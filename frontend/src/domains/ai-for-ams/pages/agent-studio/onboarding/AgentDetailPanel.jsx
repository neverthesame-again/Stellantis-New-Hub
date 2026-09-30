import React, { useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  CircleAlert,
  CircleCheck,
  Gauge,
  Loader2,
  Pencil,
  Play,
  PlugZap,
  Rocket,
  ShieldCheck,
  Wallet
} from 'lucide-react';
import { useAmsStudio } from '../../../state/useAmsStudio';
import { selectLifecycleContext } from '../../../state/selectors';
import { useAmsNavigation } from '../../../navigation/useAmsNavigation';
import { AMS_MAIN_TAB, AMS_SUBPAGE } from '../../../navigation/amsRoutes';
import {
  CONNECTION_STATUS,
  GOVERNANCE_STATUS,
  getAreaLabel,
  getRegionLabel,
  getRuntimeOption
} from '../../../model/agentOptions';
import {
  STAGE,
  canAdvance,
  getCurrentStage,
  getStage,
  getUnmetExitCriteria,
  isHarnessEligible
} from '../../../model/agentLifecycle';
import { passesEvaluation } from '../../../model/evaluationModel';
import { formatDateTime } from '../../../utils/formatters';
import AuditTrail from '../../../components/AuditTrail';
import ConnectionBadge from '../../../components/ConnectionBadge';
import LifecycleStepper from '../../../components/LifecycleStepper';

/** Number of history entries shown in the panel. */
const HISTORY_LIMIT = 8;

const GOVERNANCE_BADGE = {
  [GOVERNANCE_STATUS.NOT_SUBMITTED]: { className: 'badge-info', label: 'Not submitted' },
  [GOVERNANCE_STATUS.PENDING]: { className: 'badge-high', label: 'Pending approval' },
  [GOVERNANCE_STATUS.APPROVED]: { className: 'badge-success', label: 'Approved' },
  [GOVERNANCE_STATUS.REJECTED]: { className: 'badge-critical', label: 'Rejected' }
};

/**
 * Chip list for a detail section, or a muted "none" note.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string[]} props.items
 * @returns {JSX.Element}
 */
function ChipSection({ title, items }) {
  return (
    <div>
      <p className="ams-section-title">{title}</p>
      {items.length === 0
        ? <p className="ams-muted-note">None yet</p>
        : <div className="ams-chip-list">{items.map((item) => <span key={item} className="st-badge badge-info">{item}</span>)}</div>}
    </div>
  );
}

/**
 * Detail panel for one studio agent: lifecycle stepper with "Blocked by"
 * line (F2), the next action for the current stage, and the agent's
 * registration, runtime, evaluation, governance and history.
 *
 * @param {Object} props
 * @param {Object} props.agent
 * @param {() => void} props.onEdit            Opens the registration form.
 * @param {() => void} props.onShowPublished   Switches Agent Studio to the Published tab.
 * @param {(message: string) => void} props.showToast
 * @returns {JSX.Element}
 */
export default function AgentDetailPanel({ agent, onEdit, onShowPublished, showToast }) {
  const { state, actions } = useAmsStudio();
  const { goToTab, goToSubPage } = useAmsNavigation();
  const [verifying, setVerifying] = useState(false);

  const context = selectLifecycleContext(state);
  const stage = getCurrentStage(agent);
  const blockers = getUnmetExitCriteria(agent, context);
  const advanceable = canAdvance(agent, context);
  const nextStage = stage.number < STAGE.OPERATING ? getStage(stage.number + 1) : null;
  const runtimeOption = getRuntimeOption(agent.runtime?.type);
  const governance = GOVERNANCE_BADGE[agent.governance?.status] ?? GOVERNANCE_BADGE[GOVERNANCE_STATUS.NOT_SUBMITTED];
  const skillNames = (agent.skillIds || []).map((id) => state.skills.find((skill) => skill.id === id)?.name ?? id);
  const workflowNames = (agent.workflowIds || []).map((id) => state.workflows.find((workflow) => workflow.id === id)?.name ?? id);

  const verifyConnection = async () => {
    setVerifying(true);
    const result = await actions.verifyAgentConnection(agent.id, agent.runtime);
    setVerifying(false);
    showToast(result.status === CONNECTION_STATUS.CONNECTED ? `Connected: ${result.message}` : `Connection failed: ${result.message}`);
  };

  const openHarness = () => goToSubPage(AMS_SUBPAGE.HARNESS, { agentId: agent.id, autoRun: true });

  const advance = () => {
    actions.advanceAgentStage(agent.id);
    showToast(`${agent.name} moved to ${nextStage.label}.`);
  };

  const publish = () => {
    actions.publishAgent(agent.id);
    showToast(`${agent.name} is now listed in the Published catalogue.`);
  };

  /** The one action that moves the current stage forward. */
  const stageAction = (() => {
    switch (stage.number) {
      case STAGE.REGISTRATION:
        return { label: 'Complete registration', icon: Pencil, onClick: onEdit };
      case STAGE.RUNTIME:
        return { label: verifying ? 'Verifying…' : 'Verify connection', icon: verifying ? Loader2 : PlugZap, onClick: verifyConnection, busy: verifying };
      case STAGE.SKILLS_KNOWLEDGE:
        return { label: 'Add knowledge & tools', icon: Pencil, onClick: onEdit };
      case STAGE.WORKFLOWS:
        return { label: 'Map workflows', icon: Pencil, onClick: onEdit };
      case STAGE.HARNESS:
        return { label: 'Run in Harness', icon: Play, onClick: openHarness };
      case STAGE.EVALUATION:
        return { label: 'Open evaluation', icon: Gauge, onClick: () => goToSubPage(AMS_SUBPAGE.EVALUATE_APPROVE, { tab: 'evaluate', agentId: agent.id }) };
      case STAGE.APPROVAL:
        return { label: 'Open approval', icon: ShieldCheck, onClick: () => goToSubPage(AMS_SUBPAGE.EVALUATE_APPROVE, { tab: 'approve', agentId: agent.id }) };
      case STAGE.PUBLICATION:
        return agent.publishedAt ? null : { label: 'Publish to catalogue', icon: Rocket, onClick: publish };
      default:
        return { label: 'View in catalogue', icon: BadgeCheck, onClick: onShowPublished };
    }
  })();

  return (
    <section className="st-card ams-card ams-detail" aria-labelledby="ams-agent-detail-title">
      <header className="ams-page-header">
        <div>
          <div className="ams-badge-row">
            <span className="st-badge badge-info">{getAreaLabel(agent.area)}</span>
            {agent.serviceTier && <span className="st-badge badge-navy">{agent.serviceTier}</span>}
            <span className={`st-badge ${governance.className}`}>{governance.label}</span>
          </div>
          <h3 id="ams-agent-detail-title" className="ams-card-title">
            {agent.name} <span className="ams-card-subtitle">v{agent.version || '—'} · {agent.id}</span>
          </h3>
          <p className="ams-card-text">{agent.purpose || 'No purpose described yet.'}</p>
        </div>
        <button type="button" className="st-btn st-btn-outline" onClick={onEdit}>
          <Pencil size={14} /> Edit registration
        </button>
      </header>

      <LifecycleStepper agent={agent} />

      <div className={`ams-callout ${blockers.length ? 'is-warning' : 'is-success'}`} role="status">
        {blockers.length > 0 ? (
          <>
            <CircleAlert size={16} aria-hidden="true" />
            <span><strong>Blocked by:</strong> {blockers.map((criterion) => criterion.label).join('; ')}.</span>
          </>
        ) : (
          <>
            <CircleCheck size={16} aria-hidden="true" />
            <span>
              {nextStage ? <>Ready to advance to <strong>{nextStage.label}</strong>.</> : 'Operating in production — lifecycle complete.'}
            </span>
          </>
        )}
      </div>

      <div className="ams-page-actions">
        {stageAction && (
          <button type="button" className="st-btn st-btn-primary" onClick={stageAction.onClick} disabled={stageAction.busy}>
            <stageAction.icon size={14} className={stageAction.busy ? 'ams-spin' : undefined} /> {stageAction.label}
          </button>
        )}
        {nextStage && (
          <button
            type="button"
            className="st-btn st-btn-action"
            onClick={advance}
            disabled={!advanceable}
            title={advanceable ? undefined : 'Meet the exit criteria of the current stage first'}
          >
            Advance to {nextStage.label} <ArrowRight size={14} />
          </button>
        )}
        {isHarnessEligible(agent) && stage.number !== STAGE.HARNESS && (
          <button type="button" className="st-btn st-btn-outline" onClick={openHarness}>
            <Play size={14} /> Run in Harness
          </button>
        )}
        {stage.number >= STAGE.HARNESS && (
          <button type="button" className="st-btn st-btn-outline" onClick={() => goToSubPage(AMS_SUBPAGE.MONITOR_FINOPS, { tab: 'cost', agentId: agent.id })}>
            <Wallet size={14} /> Cost
          </button>
        )}
      </div>

      <dl className="ams-details ams-details-grid ams-details-3">
        <div><dt>Service / portfolio</dt><dd>{agent.service || '—'}</dd></div>
        <div><dt>Team</dt><dd>{agent.team || '—'}</dd></div>
        <div><dt>Owner</dt><dd>{agent.owner || '—'}</dd></div>
        <div><dt>Family</dt><dd>{agent.family}</dd></div>
        <div><dt>Approver</dt><dd>{agent.approver}</dd></div>
        <div><dt>Harness runs passed</dt><dd>{agent.harness?.successfulRuns ?? 0}</dd></div>
      </dl>

      <div>
        <p className="ams-section-title">Runtime</p>
        <dl className="ams-details ams-details-grid ams-details-3">
          <div><dt>Runtime</dt><dd>{runtimeOption?.label ?? '—'}</dd></div>
          <div className="is-wide"><dt>Base URL</dt><dd className="ams-mono">{agent.runtime?.baseUrl || '—'}</dd></div>
          <div><dt>Agent ID</dt><dd className="ams-mono">{agent.runtime?.agentId || '—'}</dd></div>
          <div><dt>Health check</dt><dd className="ams-mono">{agent.runtime?.healthCheckUrl || '—'}</dd></div>
          <div><dt>Region</dt><dd>{getRegionLabel(agent.runtime?.region)}</dd></div>
          <div>
            <dt>Connection</dt>
            <dd>
              <ConnectionBadge status={agent.runtime?.connectionStatus} latencyMs={agent.runtime?.latencyMs} />
              {agent.runtime?.checkedAt && <span className="ams-muted-note"> {formatDateTime(agent.runtime.checkedAt)}</span>}
            </dd>
          </div>
        </dl>
      </div>

      <div className="ams-detail-columns">
        <ChipSection title="Skills" items={skillNames} />
        <ChipSection title="Knowledge sources" items={agent.knowledgeSources || []} />
        <ChipSection title="Connected tools" items={agent.connectedTools || []} />
        <ChipSection title="Workflows" items={workflowNames} />
      </div>

      <div className="ams-detail-columns">
        <div>
          <p className="ams-section-title">Evaluation</p>
          {agent.evaluation ? (
            <p className="ams-card-text">
              Score <strong>{agent.evaluation.score}</strong> against pass mark {context.passMark}{' '}
              <span className={`st-badge ${passesEvaluation(agent, context) ? 'badge-success' : 'badge-critical'}`}>
                {passesEvaluation(agent, context) ? 'Pass' : 'Not passing'}
              </span>
              <br /><span className="ams-muted-note">Evaluated {formatDateTime(agent.evaluation.evaluatedAt)}</span>
            </p>
          ) : <p className="ams-muted-note">Not evaluated yet</p>}
        </div>
        <div>
          <p className="ams-section-title">Governance</p>
          <p className="ams-card-text">
            <span className={`st-badge ${governance.className}`}>{governance.label}</span>
            {agent.governance?.decidedBy && <> by {agent.governance.decidedBy}</>}
            {agent.governance?.comment && <><br /><span className="ams-muted-note">“{agent.governance.comment}”</span></>}
            {agent.governance?.inboxItemId && agent.governance.status === GOVERNANCE_STATUS.PENDING && (
              <>
                <br />
                <button type="button" className="ams-link-button" onClick={() => goToTab(AMS_MAIN_TAB.INBOX)}>
                  Also waiting in the Workflow Inbox ({agent.governance.inboxItemId})
                </button>
              </>
            )}
          </p>
        </div>
      </div>

      <div>
        <p className="ams-section-title">Lifecycle history</p>
        <AuditTrail entries={(agent.history || []).slice(0, HISTORY_LIMIT)} showTarget={false} />
      </div>
    </section>
  );
}
