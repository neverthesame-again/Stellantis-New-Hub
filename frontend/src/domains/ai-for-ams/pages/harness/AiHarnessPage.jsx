import React, { useMemo, useRef, useState } from 'react';
import { useAmsStudio } from '../../state/useAmsStudio';
import { useRunPlayback } from '../../runs/useRunPlayback';
import { AMS_SUBPAGE, getAmsRoute } from '../../navigation/amsRoutes';
import { useAmsNavigation, useAmsRouteRequest } from '../../navigation/useAmsNavigation';
import { HARNESS_MIN_STAGE } from '../../model/agentLifecycle';
import { DEFAULT_TASK_BY_AREA } from '../../model/harnessPipeline';
import { RUN_KIND } from '../../model/runModel';
import PageHeader from '../../components/PageHeader';
import Toast from '../../components/Toast';
import { useToast } from '../../components/useToast';
import HarnessRunForm from './HarnessRunForm';
import QuickStartCards from './QuickStartCards';
import RecentRuns from './RecentRuns';
import RunDetail from './RunDetail';
import SandboxSimulation from './SandboxSimulation';
import { useSandboxSimulation } from './useSandboxSimulation';

/**
 * Default task for an agent, based on its AMS area.
 *
 * @param {Object | undefined} agent
 * @returns {string}
 */
const defaultTaskFor = (agent) => (agent ? DEFAULT_TASK_BY_AREA[agent.area] ?? '' : '');

/**
 * AI Harness (F3) — run one onboarded agent on a real ticket and see each of
 * the ten pipeline steps, the live log and the confidence gauges before the
 * agent touches production. Human-approval steps pause the run in the
 * Workflow Inbox.
 *
 * Route params:
 * - `{ agentId, task?, autoRun? }` — preselect a studio agent (and start it);
 * - `{ runId }`                    — show a run;
 * - `{ sandbox: true, agentName, autoRun? }` — legacy catalogue agents use the
 *   digital-twin sandbox, as they have no lifecycle record.
 *
 * @returns {JSX.Element}
 */
export default function AiHarnessPage() {
  const route = getAmsRoute(AMS_SUBPAGE.HARNESS);
  const { state } = useAmsStudio();
  const { goToSubPage } = useAmsNavigation();
  const { playback, isBusy, startHarnessRun, getRevealedCount } = useRunPlayback();
  const { message, showToast } = useToast();
  const formRef = useRef(null);
  const sandboxRef = useRef(null);
  const sandbox = useSandboxSimulation();
  const [sandboxAgent, setSandboxAgent] = useState(null);

  const agentsById = useMemo(() => Object.fromEntries(state.studioAgents.map((agent) => [agent.id, agent])), [state.studioAgents]);
  const eligible = state.studioAgents.filter((agent) => agent.stage >= HARNESS_MIN_STAGE);
  const [agentId, setAgentId] = useState(() => eligible[0]?.id ?? '');
  const [task, setTask] = useState(() => defaultTaskFor(eligible[0]));
  const [selectedRunId, setSelectedRunId] = useState(null);

  const harnessRuns = state.runs.filter((run) => run.kind === RUN_KIND.HARNESS);
  const shownRun = harnessRuns.find((run) => run.id === (playback?.runId ?? selectedRunId)) ?? harnessRuns[0] ?? null;

  /**
   * Starts a run and shows it.
   *
   * @param {string} runAgentId
   * @param {string} runTask
   */
  const run = (runAgentId, runTask) => {
    const runId = startHarnessRun(runAgentId, runTask);
    if (runId) setSelectedRunId(runId);
    else showToast(isBusy ? 'Another run is in progress — wait for it to finish.' : 'This agent cannot be run yet.');
  };

  const changeAgent = (nextId) => {
    setAgentId(nextId);
    setTask(defaultTaskFor(agentsById[nextId]));
  };

  useAmsRouteRequest(AMS_SUBPAGE.HARNESS, (params) => {
    if (params.sandbox) {
      setSandboxAgent(params.agentName ?? null);
      sandboxRef.current?.setAttribute('open', '');
      sandboxRef.current?.scrollIntoView({ behavior: 'smooth' });
      if (params.autoRun) sandbox.run();
      return;
    }
    if (params.runId) setSelectedRunId(params.runId);
    if (params.agentId && agentsById[params.agentId]) {
      const runTask = params.task ?? defaultTaskFor(agentsById[params.agentId]);
      setAgentId(params.agentId);
      setTask(runTask);
      if (params.autoRun) run(params.agentId, runTask);
    }
  });

  const focusForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    formRef.current?.focus({ preventScroll: true });
  };

  return (
    <div className="ams-page animate-fade-in">
      <PageHeader icon={route.icon} title={route.label} summary={route.summary} />

      <QuickStartCards
        onRunSingle={focusForm}
        onUseTemplate={() => goToSubPage(AMS_SUBPAGE.AGENT_STUDIO, { tab: 'workflows' })}
        onBuildFromScratch={() => goToSubPage(AMS_SUBPAGE.AGENT_STUDIO, { tab: 'workflows', create: true })}
      />

      <HarnessRunForm
        ref={formRef}
        agents={state.studioAgents}
        agentId={agentId}
        onAgentChange={changeAgent}
        task={task}
        onTaskChange={setTask}
        onRun={() => run(agentId, task)}
        busy={isBusy}
      />

      {shownRun && (
        <RunDetail run={shownRun} agent={agentsById[shownRun.agentId]} revealedCount={getRevealedCount(shownRun.id)} />
      )}

      <RecentRuns
        runs={harnessRuns}
        agentsById={agentsById}
        selectedRunId={shownRun?.id ?? null}
        onSelect={setSelectedRunId}
        animatingRunId={playback?.runId ?? null}
      />

      <details ref={sandboxRef} className="st-card ams-card ams-details-disclosure">
        <summary>Digital-twin sandbox (runbook rehearsal for catalogue agents)</summary>
        <SandboxSimulation simulation={sandbox} triggeredBy={sandboxAgent} />
      </details>

      <Toast message={message} />
    </div>
  );
}
