import { useCallback, useEffect, useRef, useState } from 'react';
import { HARNESS_STEPS } from '../../agentStudioData';
import { useAgentStudio } from '../../useAgentStudio';
import { computeGauges, nextRunId, planHarnessRun, STEP_BY_KEY } from './harnessUtils';

const nowIso = () => new Date().toISOString();

/**
 * Drives one harness run at a time: records the run in the shared context,
 * animates the 10 pipeline steps with setTimeout and writes audit entries.
 * Timers are cleared on unmount; an in-flight run is marked as interrupted.
 */
export default function useHarnessRunner() {
  const {
    agents, harnessRuns, rules, threshold, currentUser,
    recordHarnessRun, updateHarnessRun, approveHarnessRun, addAudit
  } = useAgentStudio();

  const [activeRunId, setActiveRunId] = useState(null);
  const [running, setRunning] = useState(false);
  const timers = useRef([]);
  const inFlight = useRef(null);
  const updateRef = useRef(updateHarnessRun);

  useEffect(() => {
    updateRef.current = updateHarnessRun;
  }, [updateHarnessRun]);

  const schedule = (fn, ms) => {
    const t = setTimeout(() => {
      timers.current = timers.current.filter((x) => x !== t);
      fn();
    }, ms);
    timers.current.push(t);
  };

  useEffect(() => () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const runId = inFlight.current;
    if (runId) {
      updateRef.current(runId, (r) => (r.status !== 'running' ? {} : {
        status: 'failed',
        steps: r.steps.map((s) => (['pending', 'running'].includes(s.status) ? { ...s, status: 'skipped', detail: 'Interrupted — harness view closed' } : s)),
        log: [...r.log, { t: nowIso(), level: 'ERROR', msg: 'Run interrupted — harness view closed before completion' }]
      }));
      inFlight.current = null;
    }
  }, []);

  const start = useCallback(({ agent, task, requireApproval, dryRun }) => {
    if (inFlight.current) return null;
    const cleanTask = task.trim();
    const plan = planHarnessRun(agent, cleanTask, { requireApproval, dryRun, rules, threshold, harnessRuns, agents, currentUser });
    const gauges = computeGauges(agent);
    const runId = nextRunId(harnessRuns);
    const startedAt = nowIso();

    recordHarnessRun({
      id: runId,
      agentId: agent.id,
      task: cleanTask,
      status: 'running',
      startedAt,
      durationMs: 0,
      confidence: gauges.confidence,
      reuse: gauges.reuse,
      coverage: gauges.coverage,
      approver: requireApproval ? (agent.approver || currentUser) : '',
      requireApproval,
      dryRun,
      steps: HARNESS_STEPS.map((s) => ({ key: s.key, status: 'pending', ms: 0, detail: s.description })),
      log: [
        { t: startedAt, level: 'INFO', msg: `Harness run ${runId} initialised for ${agent.name} v${agent.version}` },
        { t: startedAt, level: 'INFO', msg: `Task: "${cleanTask}"` },
        { t: startedAt, level: 'INFO', msg: `Mode: ${dryRun ? 'DRY RUN (no tool writes)' : 'LIVE'} · human approval ${requireApproval ? 'required' : 'not required'}` }
      ]
    });
    addAudit({ action: 'Harness run started', agentId: agent.id, type: 'harness', detail: `Run ${runId} · "${cleanTask}"${dryRun ? ' · dry run' : ''}` });

    inFlight.current = runId;
    setActiveRunId(runId);
    setRunning(true);

    let elapsed = 0;

    const finish = (patchFn, audit) => {
      updateHarnessRun(runId, patchFn);
      addAudit({ agentId: agent.id, type: 'harness', ...audit });
      inFlight.current = null;
      setRunning(false);
    };

    const runStep = (i) => {
      if (i >= plan.length) {
        finish((r) => ({
          status: 'completed',
          approver: r.approver || 'Auto-released',
          log: [...r.log, { t: nowIso(), level: 'INFO', msg: `Harness execution completed successfully in ${(elapsed / 1000).toFixed(1)} s` }]
        }), { action: 'Harness run completed', detail: `Run ${runId} completed in ${(elapsed / 1000).toFixed(1)} s` });
        return;
      }
      const p = plan[i];
      const label = STEP_BY_KEY[p.key].label;
      updateHarnessRun(runId, (r) => ({
        steps: r.steps.map((s) => (s.key === p.key ? { ...s, status: 'running' } : s)),
        log: [...r.log, { t: nowIso(), level: 'INFO', msg: `[${i + 1}/10] ${label} …` }]
      }));

      schedule(() => {
        elapsed += p.ms;
        const t = nowIso();
        updateHarnessRun(runId, (r) => ({
          durationMs: elapsed,
          steps: r.steps.map((s) => (s.key === p.key ? { ...s, status: p.status, ms: p.ms, detail: p.detail } : s)),
          log: [...r.log, ...p.logs.map((l) => ({ t, ...l }))]
        }));

        if (p.status === 'failed') {
          finish((r) => ({
            status: 'failed',
            steps: r.steps.map((s) => (s.status === 'pending' ? { ...s, status: 'skipped', detail: `Skipped after failed ${label}` } : s)),
            log: [...r.log, { t: nowIso(), level: 'ERROR', msg: `Harness stopped at ${label} — ${plan.length}/10 steps executed` }]
          }), { action: 'Harness run failed', detail: `Run ${runId} stopped at ${label}: ${p.detail}` });
          return;
        }
        if (p.status === 'waiting') {
          finish((r) => ({
            status: 'awaiting_approval',
            log: [...r.log, { t: nowIso(), level: 'INFO', msg: `Paused at Human Approval — awaiting ${r.approver || currentUser}` }]
          }), { action: 'Approval requested', detail: `Run ${runId} awaiting human approval` });
          return;
        }
        runStep(i + 1);
      }, p.ms);
    };

    schedule(() => runStep(0), 250);
    return runId;
  }, [agents, harnessRuns, rules, threshold, currentUser, recordHarnessRun, updateHarnessRun, addAudit]);

  const approve = useCallback((runId) => {
    approveHarnessRun(runId);
  }, [approveHarnessRun]);

  const reject = useCallback((runId, reason = '') => {
    const run = harnessRuns.find((r) => r.id === runId);
    updateHarnessRun(runId, (r) => ({
      status: 'failed',
      approver: currentUser,
      steps: r.steps.map((s) => (s.key === 'human' ? { ...s, status: 'failed', detail: `Rejected by ${currentUser}` } : s)),
      log: [...r.log, { t: nowIso(), level: 'ERROR', msg: `Rejected by ${currentUser}${reason ? ` — ${reason}` : ''} · outputs discarded` }]
    }));
    addAudit({ action: 'Harness run rejected', agentId: run?.agentId, type: 'harness', detail: `Run ${runId} rejected at Human Approval` });
  }, [harnessRuns, currentUser, updateHarnessRun, addAudit]);

  return { activeRunId, running, start, approve, reject };
}
