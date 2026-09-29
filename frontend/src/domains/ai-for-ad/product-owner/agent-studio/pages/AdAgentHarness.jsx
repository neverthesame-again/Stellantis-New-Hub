import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  PlayCircle, Rocket, Bot, History, Gauge, UserPlus, Activity, CircleCheck, Hand, CircleX, Timer, CircleAlert
} from 'lucide-react';
import { useAgentStudio } from '../useAgentStudio';
import HarnessQuickStart from '../components/harness/HarnessQuickStart';
import HarnessAgentPicker from '../components/harness/HarnessAgentPicker';
import HarnessExecutePanel from '../components/harness/HarnessExecutePanel';
import RunHistory from '../components/harness/RunHistory';
import RunDetailDrawer from '../components/harness/RunDetailDrawer';
import useHarnessRunner from '../components/harness/useHarnessRunner';
import { isHarnessReady } from '../components/harness/harnessUtils';
import '../adAgentStudio.css';
import '../adAgentHarness.css';

/**
 * F3 — AI Harness. Runs onboarded AD agents through the governed 10-step
 * harness pipeline (context → tools → evaluation gate → ISO 26262 policy →
 * human approval) and keeps a filterable run history.
 */
export default function AdAgentHarness() {
  const { agents, harnessRuns, getAgent, focusAgentId, setFocusAgentId, navigate } = useAgentStudio();
  const runner = useHarnessRunner();

  const [tab, setTab] = useState('quick');
  const [selectedId, setSelectedId] = useState(() => (agents.find(isHarnessReady) || agents[0])?.id || null);
  const [preset, setPreset] = useState({ task: '', nonce: 0 });
  const [drawerRunId, setDrawerRunId] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = useCallback((msg, kind = 'info') => {
    setToast({ msg, kind });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const openSingle = useCallback((agentId, task = '') => {
    if (agentId && !(runner.running && agentId !== selectedId)) setSelectedId(agentId);
    setPreset((p) => ({ task, nonce: p.nonce + 1 }));
    setTab('single');
  }, [runner.running, selectedId]);

  // Cross-tab focus (e.g. "Run in harness" from the catalogue): adopt the agent
  // during render, then clear the shared focus once handled.
  const [handledFocus, setHandledFocus] = useState(null);
  if (focusAgentId && focusAgentId !== handledFocus) {
    setHandledFocus(focusAgentId);
    if (getAgent(focusAgentId) && !runner.running) {
      setSelectedId(focusAgentId);
      setPreset((p) => ({ task: '', nonce: p.nonce + 1 }));
      setTab('single');
    }
  } else if (!focusAgentId && handledFocus) {
    setHandledFocus(null);
  }
  useEffect(() => {
    if (focusAgentId) setFocusAgentId(null);
  }, [focusAgentId, setFocusAgentId]);

  const readyAgents = useMemo(() => agents.filter(isHarnessReady), [agents]);

  const kpis = useMemo(() => {
    const finished = harnessRuns.filter((r) => r.status !== 'running' && r.durationMs > 0);
    const avg = finished.length ? finished.reduce((s, r) => s + r.durationMs, 0) / finished.length / 1000 : 0;
    return {
      total: harnessRuns.length,
      ready: readyAgents.length,
      completed: harnessRuns.filter((r) => r.status === 'completed').length,
      awaiting: harnessRuns.filter((r) => r.status === 'awaiting_approval').length,
      failed: harnessRuns.filter((r) => r.status === 'failed').length,
      avg
    };
  }, [harnessRuns, readyAgents]);

  const agent = selectedId ? getAgent(selectedId) : null;
  const activeRun = runner.activeRunId ? harnessRuns.find((r) => r.id === runner.activeRunId) : null;
  const panelRun = activeRun && agent && activeRun.agentId === agent.id ? activeRun : null;
  const lastRun = agent ? harnessRuns.find((r) => r.agentId === agent.id) : null;
  const drawerRun = drawerRunId ? harnessRuns.find((r) => r.id === drawerRunId) : null;

  const openRun = useCallback((runId) => {
    setTab('history');
    setDrawerRunId(runId);
  }, []);
  const closeDrawer = useCallback(() => setDrawerRunId(null), []);

  const approve = (runId) => { runner.approve(runId); showToast(`Run ${runId} approved and released`); };
  const reject = (runId) => { runner.reject(runId); showToast(`Run ${runId} rejected`, 'error'); };
  const rerun = (run) => { setDrawerRunId(null); openSingle(run.agentId, run.task); };

  const TABS = [
    { id: 'quick', label: 'Quick Start', icon: Rocket, badge: null },
    { id: 'single', label: 'Single Agent Harness', icon: Bot, badge: readyAgents.length },
    { id: 'history', label: 'Run History', icon: History, badge: harnessRuns.length, alert: kpis.awaiting }
  ];

  return (
    <div className="ad-studio-scope ad-hrn-page">
      {/* Header */}
      <div className="ad-studio-header">
        <div className="ad-studio-header-title">
          <div className="ad-studio-header-icon"><PlayCircle size={20} /></div>
          <div>
            <span className="ad-studio-eyebrow">Enterprise Orchestration</span>
            <h2>AI Harness {runner.running && <span className="ad-studio-badge is-info"><Activity size={10} /> Pipeline running</span>}</h2>
            <p>Run onboarded AD agents through a governed 10-step pipeline — context, tools, evaluation gate, ISO 26262 policy enforcement and human approval</p>
          </div>
        </div>
        <div className="ad-studio-header-actions">
          <button type="button" className="ad-studio-btn" onClick={() => navigate({ tab: 'agents', view: 'onboarding' })}>
            <UserPlus size={14} /> Onboarding Studio
          </button>
          <button type="button" className="ad-studio-btn is-primary" onClick={() => navigate({ tab: 'evaluation', agentId: tab === 'single' ? selectedId : null })}>
            <Gauge size={14} /> Evaluation Center
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="ad-studio-kpi-grid">
        <div className="ad-studio-kpi">
          <span className="ad-studio-kpi-label"><Activity size={12} /> Harness runs</span>
          <span className="ad-studio-kpi-value">{kpis.total}</span>
          <span className="ad-studio-kpi-note">All agents · Release 4.2 / 4.3</span>
        </div>
        <div className="ad-studio-kpi">
          <span className="ad-studio-kpi-label"><Bot size={12} /> Agents ready</span>
          <span className="ad-studio-kpi-value">{kpis.ready}<small>/ {agents.length}</small></span>
          <span className="ad-studio-kpi-note">Stage ≥ 2 · runtime connected · not suspended</span>
        </div>
        <div className="ad-studio-kpi">
          <span className="ad-studio-kpi-label"><CircleCheck size={12} /> Completed</span>
          <span className="ad-studio-kpi-value ad-hrn-kpi-good">{kpis.completed}</span>
          <span className="ad-studio-kpi-note">{kpis.total ? Math.round((kpis.completed / kpis.total) * 100) : 0} % success rate</span>
        </div>
        <div className="ad-studio-kpi">
          <span className="ad-studio-kpi-label"><Hand size={12} /> Awaiting approval</span>
          <span className="ad-studio-kpi-value ad-hrn-kpi-warn">{kpis.awaiting}</span>
          <span className="ad-studio-kpi-note">Human-in-the-loop queue</span>
        </div>
        <div className="ad-studio-kpi">
          <span className="ad-studio-kpi-label"><CircleX size={12} /> Failed</span>
          <span className="ad-studio-kpi-value ad-hrn-kpi-bad">{kpis.failed}</span>
          <span className="ad-studio-kpi-note">Gate, policy or reviewer stops</span>
        </div>
        <div className="ad-studio-kpi">
          <span className="ad-studio-kpi-label"><Timer size={12} /> Avg duration</span>
          <span className="ad-studio-kpi-value">{kpis.avg.toFixed(1)}<small>s</small></span>
          <span className="ad-studio-kpi-note">Finished runs</span>
        </div>
      </div>

      {/* Inner tabs */}
      <div className="ad-hrn-tabs" role="tablist" aria-label="AI Harness views">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={`ad-hrn-tab ${tab === t.id ? 'is-active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              <Icon size={14} /> {t.label}
              {t.badge !== null && <span className="ad-hrn-tab-badge">{t.badge}</span>}
              {t.alert > 0 && <span className="ad-hrn-tab-alert" title={`${t.alert} awaiting approval`}>{t.alert}</span>}
            </button>
          );
        })}
      </div>

      {tab === 'quick' && (
        <HarnessQuickStart
          agents={agents}
          runs={harnessRuns}
          onOpenSingle={openSingle}
          onNavigate={navigate}
          onToast={showToast}
        />
      )}

      {tab === 'single' && (
        <div className="ad-studio-split">
          <HarnessAgentPicker
            agents={agents}
            selectedId={selectedId}
            onSelect={(id) => {
              if (id === selectedId) return;
              setSelectedId(id);
              setPreset((p) => ({ task: '', nonce: p.nonce + 1 }));
            }}
            locked={runner.running}
          />
          {agent ? (
            <HarnessExecutePanel
              key={`${agent.id}:${preset.nonce}`}
              agent={agent}
              initialTask={preset.task}
              run={panelRun}
              lastRun={lastRun}
              runner={runner}
              onNavigate={navigate}
              onOpenRun={openRun}
              onToast={showToast}
            />
          ) : (
            <div className="ad-studio-empty">
              <CircleAlert size={18} /><br />Select an onboarded agent to configure a harness run.
            </div>
          )}
        </div>
      )}

      {tab === 'history' && (
        <RunHistory
          runs={harnessRuns}
          agents={agents}
          getAgent={getAgent}
          onOpen={setDrawerRunId}
          selectedRunId={drawerRunId}
        />
      )}

      {drawerRun && (
        <RunDetailDrawer
          run={drawerRun}
          agent={getAgent(drawerRun.agentId)}
          onClose={closeDrawer}
          onApprove={approve}
          onReject={reject}
          onRerun={rerun}
        />
      )}

      {toast && (
        <div className={`ad-studio-toast ${toast.kind === 'error' ? 'is-error' : ''}`} role="status">
          {toast.kind === 'error' ? <CircleX size={15} /> : <CircleCheck size={15} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
