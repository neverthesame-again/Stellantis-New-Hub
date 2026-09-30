import React, { useState } from 'react';
import {
  ArrowRight,
  Bot,
  CirclePlay,
  Compass,
  FolderPlus,
  Network,
  RotateCcw,
  Wallet,
  Workflow
} from 'lucide-react';
import { useAmsStudio } from '../../state/useAmsStudio';
import { selectLifecycleContext } from '../../state/selectors';
import { useAmsNavigation } from '../../navigation/useAmsNavigation';
import { AMS_SUBPAGE, getAmsRoute } from '../../navigation/amsRoutes';
import { HARNESS_MIN_STAGE, LIFECYCLE_STAGES, countAgentsByStage } from '../../model/agentLifecycle';
import { agentsInScope, getNextStepGaps, getProgrammeScope, getRecentActivity, getScorecard } from '../../model/opsOverview';
import AuditTrail from '../../components/AuditTrail';
import Modal from '../../components/Modal';
import PageHeader from '../../components/PageHeader';
import Toast from '../../components/Toast';
import { useToast } from '../../components/useToast';
import AgentCards from './AgentCards';
import ExecuteBar from './ExecuteBar';
import ProgrammeSection from './ProgrammeSection';
import ProgrammeWizardModal from './ProgrammeWizardModal';

/**
 * Ops Studio (F11 + F12 programmes) — the starting point of the AMS AI
 * journey: the guided next step, platform action tiles, the agent scorecard
 * and pipeline by lifecycle stage, an execute bar that runs an agent in
 * place, agent cards, recent activity and programmes. Everything respects the
 * active programme.
 *
 * @returns {JSX.Element}
 */
export default function OpsStudioPage() {
  const route = getAmsRoute(AMS_SUBPAGE.OPS_STUDIO);
  const { state, actions } = useAmsStudio();
  const { goToTab, goToSubPage } = useAmsNavigation();
  const [isWizardOpen, setWizardOpen] = useState(false);
  const [isResetOpen, setResetOpen] = useState(false);
  const { message, showToast } = useToast();

  const scope = getProgrammeScope(state);
  const agents = agentsInScope(state, scope);
  const runnable = agents.filter((agent) => agent.stage >= HARNESS_MIN_STAGE);
  const stageCounts = countAgentsByStage(agents);
  const { summary, gaps } = getNextStepGaps(state, scope, selectLifecycleContext(state));

  /**
   * Opens the page or tab a gap or tile points to.
   *
   * @param {{ kind: 'subpage' | 'tab', id: string, params?: Object }} target
   */
  const go = (target) => (target.kind === 'tab' ? goToTab(target.id, target.params) : goToSubPage(target.id, target.params));

  const actionTiles = [
    { icon: FolderPlus, label: 'New Programme', text: 'Group agents by service portfolio', onClick: () => setWizardOpen(true) },
    { icon: Bot, label: 'Onboard Agent', text: 'Register an agent and start its lifecycle', onClick: () => goToSubPage(AMS_SUBPAGE.AGENT_STUDIO, { tab: 'onboarding', register: true }) },
    { icon: CirclePlay, label: 'Run Harness', text: 'Test an agent on a real ticket', onClick: () => goToSubPage(AMS_SUBPAGE.HARNESS) },
    { icon: Network, label: 'Knowledge Fabric', text: 'See what agents know and the debt', onClick: () => goToSubPage(AMS_SUBPAGE.KNOWLEDGE_FABRIC) },
    { icon: Workflow, label: 'Workflows', text: 'Chain agents into incident flows', onClick: () => goToSubPage(AMS_SUBPAGE.AGENT_STUDIO, { tab: 'workflows' }) },
    { icon: Wallet, label: 'FinOps', text: 'What AI costs to run', onClick: () => goToSubPage(AMS_SUBPAGE.MONITOR_FINOPS, { tab: 'cost' }) }
  ];

  const confirmReset = () => {
    actions.resetDemoData();
    setResetOpen(false);
    showToast('Demo data restored.');
  };

  return (
    <div className="ams-page animate-fade-in">
      <PageHeader
        icon={route.icon}
        title={route.label}
        summary={route.summary}
        actions={(
          <>
            <label className="ams-inline-form">
              <span className="ams-field-label">Programme</span>
              <select className="ams-input" value={state.activeProgrammeId ?? ''} onChange={(event) => actions.activateProgramme(event.target.value || null)}>
                <option value="">All programmes</option>
                {state.programmes.map((programme) => <option key={programme.id} value={programme.id}>{programme.name}</option>)}
              </select>
            </label>
            <button type="button" className="st-btn st-btn-outline" onClick={() => setResetOpen(true)}>
              <RotateCcw size={14} /> Reset demo data
            </button>
          </>
        )}
      />

      <section className="ams-guide" aria-labelledby="ams-guide-title">
        <div className="ams-guide-head">
          <Compass size={18} aria-hidden="true" />
          <h3 id="ams-guide-title" className="ams-card-title">Next step</h3>
          <span className="ams-muted-note">{summary}</span>
        </div>
        {gaps.length === 0 ? (
          <p className="ams-card-text">Nothing is waiting — every agent is where it should be.</p>
        ) : (
          <ul className="ams-guide-list">
            {gaps.slice(0, 3).map((gap, index) => (
              <li key={gap.id}>
                <button type="button" className={`ams-guide-item ${index === 0 ? 'is-primary' : ''}`} onClick={() => go(gap.target)}>
                  <span>{gap.message}</span>
                  <ArrowRight size={15} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="ams-journey" role="group" aria-label="Platform actions">
        {actionTiles.map(({ icon: Icon, label, text, onClick }) => (
          <button key={label} type="button" className="ams-journey-step" onClick={onClick}>
            <span className="ams-journey-step-head"><Icon size={16} aria-hidden="true" /><span>{label}</span></span>
            <span className="ams-journey-step-text">{text}</span>
          </button>
        ))}
      </div>

      <section aria-labelledby="ams-scorecard-title" className="ams-page">
        <h3 id="ams-scorecard-title" className="ams-section-title">
          Agent scorecard{scope.programme ? ` — ${scope.programme.name}` : ''}
        </h3>
        <div className="ams-kpi-row">
          {getScorecard(state, scope).map(({ id, label, value, hint }) => (
            <div key={id} className="st-card ams-kpi">
              <span className="ams-kpi-label">{label}</span>
              <span className="ams-kpi-value">{value}</span>
              <span className="ams-muted-note">{hint}</span>
            </div>
          ))}
        </div>
        <ol className="ams-pipeline" aria-label="Agents by lifecycle stage">
          {LIFECYCLE_STAGES.map((stage) => (
            <li key={stage.id}>
              <button
                type="button"
                className={`ams-pipeline-stage ${stageCounts[stage.number] ? 'has-agents' : ''}`}
                onClick={() => goToSubPage(AMS_SUBPAGE.AGENT_STUDIO, { tab: 'onboarding' })}
                title={stage.description}
              >
                <span className="ams-pipeline-count">{stageCounts[stage.number]}</span>
                <span className="ams-pipeline-label">{stage.number}. {stage.label}</span>
              </button>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="ams-execute-title" className="ams-page">
        <h3 id="ams-execute-title" className="ams-section-title">Run an agent now</h3>
        <ExecuteBar key={state.activeProgrammeId ?? 'all'} agents={runnable} showToast={showToast} />
        <AgentCards agents={runnable} workflows={state.workflows} />
      </section>

      <div className="ams-detail-columns">
        <section className="st-card ams-card" aria-labelledby="ams-activity-title">
          <h3 id="ams-activity-title" className="ams-card-title">Recent activity</h3>
          <AuditTrail entries={getRecentActivity(state, scope)} emptyMessage="No runs, approvals or stage changes yet." />
        </section>
        <ProgrammeSection onNewProgramme={() => setWizardOpen(true)} showToast={showToast} />
      </div>

      {isWizardOpen && (
        <ProgrammeWizardModal
          onClose={() => setWizardOpen(false)}
          onCreated={(_id, name) => {
            setWizardOpen(false);
            showToast(`Programme "${name}" created and set active.`);
          }}
        />
      )}

      {isResetOpen && (
        <Modal
          title="Reset demo data?"
          icon={RotateCcw}
          onClose={() => setResetOpen(false)}
          maxWidth={460}
          footer={(
            <>
              <button type="button" className="st-btn st-btn-outline" onClick={() => setResetOpen(false)}>Cancel</button>
              <button type="button" className="st-btn st-btn-primary" onClick={confirmReset}>Reset</button>
            </>
          )}
        >
          <p className="ams-card-text">
            This replaces everything you changed in AI for AMS — agents and their lifecycle, runs, workflows,
            incidents, approvals, programmes, rules, subscriptions and audit history — with the original demo data.
            It only affects your account on this browser.
          </p>
        </Modal>
      )}

      <Toast message={message} />
    </div>
  );
}
