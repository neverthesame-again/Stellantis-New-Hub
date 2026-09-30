import React, { useState } from 'react';
import { CircleCheck, CircleX, RefreshCw } from 'lucide-react';
import { useAmsStudio } from '../../../state/useAmsStudio';
import { useAmsNavigation } from '../../../navigation/useAmsNavigation';
import { AMS_MAIN_TAB } from '../../../navigation/amsRoutes';
import { GOVERNANCE_DECISION } from '../../../state/constants';
import { GOVERNANCE_STATUS } from '../../../model/agentOptions';
import { STAGE, getCurrentStage } from '../../../model/agentLifecycle';
import { getComplianceChecklist } from '../../../model/governancePolicies';
import { formatDateTime } from '../../../utils/formatters';

/**
 * Per-agent compliance checklist with approve / reject (F7). Approval is only
 * possible when every guardrail passes; rejection needs a comment. Both write
 * the audit trail and move the agent's lifecycle stage.
 *
 * @param {Object} props
 * @param {Object} props.agent
 * @param {(message: string) => void} props.showToast
 * @returns {JSX.Element}
 */
export default function ApprovalDecisionPanel({ agent, showToast }) {
  const { actions } = useAmsStudio();
  const { goToTab } = useAmsNavigation();
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState(false);

  const checklist = getComplianceChecklist(agent);
  const failing = checklist.filter((check) => !check.passed);
  const governance = agent.governance ?? {};
  const pending = agent.stage === STAGE.APPROVAL && governance.status === GOVERNANCE_STATUS.PENDING;

  const approve = () => {
    actions.decideAgentApproval(agent.id, GOVERNANCE_DECISION.APPROVE, comment);
    showToast(`${agent.name} approved and moved to Published stage.`);
    setComment('');
  };

  const reject = () => {
    if (!comment.trim()) {
      setCommentError(true);
      return;
    }
    actions.decideAgentApproval(agent.id, GOVERNANCE_DECISION.REJECT, comment);
    showToast(`${agent.name} rejected and returned to Evaluation.`);
    setComment('');
    setCommentError(false);
  };

  const rescan = () => {
    actions.scanCompliance(agent.id);
    showToast(`Compliance scan: ${checklist.length - failing.length} of ${checklist.length} checks pass.`);
  };

  return (
    <section className="st-card ams-card ams-detail" aria-labelledby="ams-approval-title">
      <header className="ams-page-header">
        <div>
          <h3 id="ams-approval-title" className="ams-card-title">{agent.name}</h3>
          <p className="ams-card-subtitle">
            {agent.serviceTier || 'Untiered'} · Stage {agent.stage} · {getCurrentStage(agent).label} · approver {agent.approver}
          </p>
        </div>
        <button type="button" className="st-btn st-btn-outline" onClick={rescan}>
          <RefreshCw size={14} /> Re-run compliance scan
        </button>
      </header>

      <p className="ams-muted-note">
        {governance.submittedAt && <>Submitted {formatDateTime(governance.submittedAt)}. </>}
        {governance.lastScanAt ? <>Last scan {formatDateTime(governance.lastScanAt)}.</> : 'Checks are evaluated live.'}
        {governance.inboxItemId && pending && (
          <> Also in the <button type="button" className="ams-link-button" onClick={() => goToTab(AMS_MAIN_TAB.INBOX)}>Workflow Inbox ({governance.inboxItemId})</button>.</>
        )}
      </p>

      <ul className="ams-checklist" aria-label="Guardrail checklist">
        {checklist.map((check) => (
          <li key={check.id} className={check.passed ? 'is-pass' : 'is-fail'}>
            {check.passed
              ? <CircleCheck size={16} aria-label="Pass" />
              : <CircleX size={16} aria-label="Fail" />}
            <span className="ams-checklist-label">{check.label}</span>
            <span className="ams-checklist-evidence">{check.evidence}</span>
          </li>
        ))}
      </ul>

      {pending ? (
        <div className="ams-decision">
          <label className="ams-field">
            <span className="ams-field-label">Decision comment {commentError && <span className="ams-form-error">— required to reject</span>}</span>
            <textarea
              className="ams-input"
              rows={2}
              value={comment}
              onChange={(event) => { setComment(event.target.value); setCommentError(false); }}
              placeholder="Conditions, reasons or follow-ups"
              aria-invalid={commentError}
            />
          </label>
          <div className="ams-page-actions">
            <button
              type="button"
              className="st-btn ams-btn-success"
              onClick={approve}
              disabled={failing.length > 0}
              title={failing.length > 0 ? `Fix failing checks first: ${failing.map((check) => check.label).join(', ')}` : undefined}
            >
              <CircleCheck size={15} /> Approve
            </button>
            <button type="button" className="st-btn st-btn-outline ams-btn-danger" onClick={reject}>
              <CircleX size={15} /> Reject
            </button>
          </div>
          {failing.length > 0 && (
            <p className="ams-muted-note">Approval is available once every guardrail passes ({failing.length} failing).</p>
          )}
        </div>
      ) : (
        <p className="ams-card-text">
          {governance.status === GOVERNANCE_STATUS.NOT_SUBMITTED
            ? 'Not submitted for approval yet — the agent must pass evaluation and advance to the Approval stage.'
            : <>
                <strong>{governance.status === GOVERNANCE_STATUS.APPROVED ? 'Approved' : 'Rejected'}</strong>
                {governance.decidedBy && <> by {governance.decidedBy}</>}
                {governance.decidedAt && <> on {formatDateTime(governance.decidedAt)}</>}
                {governance.comment && <> — “{governance.comment}”</>}
              </>}
        </p>
      )}
    </section>
  );
}
