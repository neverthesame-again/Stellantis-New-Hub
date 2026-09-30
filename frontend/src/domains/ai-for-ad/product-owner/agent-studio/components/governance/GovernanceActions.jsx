import React, { useState } from 'react';
import {
  Gavel, CircleCheck, CircleX, TriangleAlert, Award, Rocket, CirclePause, CirclePlay,
  ArrowLeft, FlaskConical, BadgeCheck, Lock, Info
} from 'lucide-react';
import { formatDateTime } from '../../agentStudioData';
import { useAgentStudio } from '../../useAgentStudio';

/**
 * GovernanceActions — the state-dependent action area for one agent:
 * decision (pending) → certificate (stage 7) → publish (stage 8) → operate (stage 9).
 * Mounted with `key={agent.id}` so local form state resets per agent.
 */
export default function GovernanceActions({ agent, notify }) {
  const { governance, stage } = agent;

  if (governance.status === 'rejected') return <RejectedPanel agent={agent} />;
  if (governance.status === 'pending' || (stage === 6 && governance.status !== 'approved')) {
    return <DecisionPanel agent={agent} notify={notify} />;
  }
  if (governance.status === 'not_submitted') return <NotSubmittedPanel agent={agent} />;
  if (stage === 7) return <CertificatePanel agent={agent} notify={notify} />;
  if (stage >= 8) {
    return (
      <>
        <CertificateCard agent={agent} />
        {stage === 8 ? <PublishPanel agent={agent} notify={notify} /> : <OperationsPanel agent={agent} notify={notify} />}
      </>
    );
  }
  return null;
}

function DecisionPanel({ agent, notify }) {
  const { currentUser, mandatoryFailures, decideGovernance } = useAgentStudio();
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const failing = mandatoryFailures(agent);
  const onBehalf = agent.approver && agent.approver !== currentUser;

  const decide = (decision) => {
    if (decision === 'reject' && !comment.trim()) {
      setError('A comment is required to reject — explain what the agent team must fix.');
      notify('Rejection needs a comment', 'error');
      return;
    }
    const res = decideGovernance(agent.id, decision, comment.trim(), currentUser);
    if (!res.ok) {
      notify(res.reason || 'Decision could not be recorded', 'error');
      return;
    }
    setError('');
    notify(decision === 'approve'
      ? `${agent.name} approved — stage moved to Governance Approved. Issue the certificate next.`
      : `${agent.name} rejected — returned to Workflow Mapped for rework.`);
  };

  return (
    <section className="ad-gov-section ad-gov-decision">
      <div className="ad-gov-section-head">
        <h4><Gavel size={13} /> Approval decision</h4>
        <span className="ad-studio-badge is-warning">Awaiting decision</span>
      </div>
      <p className="ad-gov-decision-by">
        Decision by <strong>{currentUser}</strong>
        {onBehalf ? <> on behalf of <strong>{agent.approver}</strong></> : agent.approver ? ' (assigned approver)' : ' — no approver assigned'}
      </p>

      <label className="ad-studio-field">
        <span className="ad-studio-label">Decision comment {error && <span className="req">*</span>}</span>
        <textarea
          className={`ad-studio-textarea ${error ? 'is-invalid' : ''}`}
          rows={3}
          placeholder="e.g. TCL2 confirmed, SOTIF rain campaign evidence attached — approved for Release 4.2 scope."
          value={comment}
          onChange={(e) => { setComment(e.target.value); if (error) setError(''); }}
        />
        {error && <span className="ad-gov-field-error">{error}</span>}
      </label>

      {failing.length > 0 && (
        <div className="ad-gov-callout is-bad">
          <TriangleAlert size={14} />
          <div>
            <strong>Approve is blocked — {failing.length} mandatory guardrail{failing.length === 1 ? '' : 's'} failing</strong>
            <ul>
              {failing.map((p) => <li key={p.id}>{p.name} <span className="ad-studio-muted">({p.standard})</span></li>)}
            </ul>
            <span className="ad-studio-muted">Fix the evidence and re-run the compliance scan, or reject with a comment.</span>
          </div>
        </div>
      )}

      <div className="ad-gov-decision-actions">
        <button type="button" className="ad-studio-btn is-good" onClick={() => decide('approve')} disabled={failing.length > 0} title={failing.length ? 'Mandatory guardrails failing' : 'Approve'}>
          <CircleCheck size={14} /> Approve
        </button>
        <button type="button" className="ad-studio-btn is-danger" onClick={() => decide('reject')}>
          <CircleX size={14} /> Reject
        </button>
        <span className="ad-studio-muted">Every decision is written to the audit trail.</span>
      </div>
    </section>
  );
}

function CertificatePanel({ agent, notify }) {
  const { issueCertificate } = useAgentStudio();
  const issue = () => {
    const id = issueCertificate(agent.id);
    if (id) notify(`Certificate ${id} issued — version ${agent.version} frozen.`);
    else notify('Certificate can only be issued after governance approval', 'error');
  };
  return (
    <section className="ad-gov-section">
      <div className="ad-gov-section-head">
        <h4><Award size={13} /> Certification</h4>
        <span className="ad-studio-badge is-success">Approved</span>
      </div>
      <p className="ad-studio-muted ad-gov-para">
        Approved by <strong>{agent.governance.decidedBy}</strong> on {formatDateTime(agent.governance.decidedAt)}
        {agent.governance.comment ? <> — “{agent.governance.comment}”</> : null}.
        Issuing the certificate freezes version <span className="ad-gov-mono">{agent.version}</span> and records the certificate ID.
      </p>
      <button type="button" className="ad-studio-btn is-primary" onClick={issue}><Award size={14} /> Issue certificate</button>
    </section>
  );
}

function CertificateCard({ agent }) {
  return (
    <section className="ad-gov-cert">
      <div className="ad-gov-cert-seal"><BadgeCheck size={22} /></div>
      <div className="ad-gov-cert-body">
        <div className="ad-studio-eyebrow">AD agent certificate</div>
        <div className="ad-gov-cert-id">{agent.certificateId}</div>
        <dl className="ad-gov-cert-grid">
          <div><dt>Version frozen</dt><dd className="ad-gov-mono"><Lock size={11} /> {agent.version}</dd></div>
          <div><dt>Approver</dt><dd>{agent.governance.decidedBy || agent.approver || '—'}</dd></div>
          <div><dt>Decision date</dt><dd>{formatDateTime(agent.governance.decidedAt)}</dd></div>
          <div><dt>ASIL</dt><dd>ASIL {agent.asil}</dd></div>
        </dl>
      </div>
    </section>
  );
}

function PublishPanel({ agent, notify }) {
  const { publishAgent } = useAgentStudio();
  const publish = () => {
    if (publishAgent(agent.id)) notify(`${agent.name} published to AD runtime — now Active in the catalogue.`);
    else notify('Only certified agents can be published', 'error');
  };
  return (
    <section className="ad-gov-section">
      <div className="ad-gov-section-head">
        <h4><Rocket size={13} /> Publication</h4>
        <span className="ad-studio-badge is-info">Certified</span>
      </div>
      <p className="ad-studio-muted ad-gov-para">Publishing makes the agent routable in the AD runtime and visible in the AI Studio.</p>
      <button type="button" className="ad-studio-btn is-primary" onClick={publish}><Rocket size={14} /> Publish to AD runtime</button>
    </section>
  );
}

function OperationsPanel({ agent, notify }) {
  const { setOperationalState } = useAgentStudio();
  const [confirming, setConfirming] = useState(false);
  const active = agent.operationalState === 'Active';

  const suspend = () => {
    setOperationalState(agent.id, 'Suspended');
    setConfirming(false);
    notify(`${agent.name} suspended — removed from AD runtime routing.`);
  };
  const resume = () => {
    setOperationalState(agent.id, 'Active');
    notify(`${agent.name} resumed — Active in AD runtime.`);
  };

  return (
    <section className="ad-gov-section">
      <div className="ad-gov-section-head">
        <h4><Rocket size={13} /> Operational controls</h4>
        <span className={`ad-studio-badge ${active ? 'is-success' : 'is-warning'}`}>{agent.operationalState}</span>
      </div>
      {active ? (
        confirming ? (
          <div className="ad-gov-callout is-warn">
            <TriangleAlert size={14} />
            <div>
              <strong>Suspend {agent.name}?</strong>
              <span className="ad-studio-muted">Running workflows stop routing to this agent. The certificate stays valid; resume at any time.</span>
              <div className="ad-gov-decision-actions">
                <button type="button" className="ad-studio-btn is-danger is-sm" onClick={suspend}><CirclePause size={13} /> Confirm suspend</button>
                <button type="button" className="ad-studio-btn is-ghost is-sm" onClick={() => setConfirming(false)}>Cancel</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="ad-gov-decision-actions">
            <button type="button" className="ad-studio-btn is-danger" onClick={() => setConfirming(true)}><CirclePause size={14} /> Suspend</button>
            <span className="ad-studio-muted">Published and serving the AD runtime.</span>
          </div>
        )
      ) : (
        <div className="ad-gov-decision-actions">
          <button type="button" className="ad-studio-btn is-good" onClick={resume}><CirclePlay size={14} /> Resume</button>
          <span className="ad-studio-muted">Suspended — not routable until resumed.</span>
        </div>
      )}
    </section>
  );
}

function RejectedPanel({ agent }) {
  const { navigate } = useAgentStudio();
  return (
    <section className="ad-gov-section">
      <div className="ad-gov-section-head">
        <h4><CircleX size={13} /> Rejected</h4>
        <span className="ad-studio-badge is-critical">Rework required</span>
      </div>
      <div className="ad-gov-callout is-bad">
        <Info size={14} />
        <div>
          <strong>Rejected by {agent.governance.decidedBy || '—'} · {formatDateTime(agent.governance.decidedAt)}</strong>
          <span>“{agent.governance.comment || 'No comment recorded'}”</span>
        </div>
      </div>
      <button type="button" className="ad-studio-btn is-primary" onClick={() => navigate({ tab: 'agents', agentId: agent.id, view: 'onboarding' })}>
        <ArrowLeft size={14} /> Back to Onboarding Studio
      </button>
    </section>
  );
}

function NotSubmittedPanel({ agent }) {
  const { navigate } = useAgentStudio();
  return (
    <section className="ad-gov-section">
      <div className="ad-gov-callout is-info">
        <Info size={14} />
        <div>
          <strong>Not yet submitted for governance</strong>
          <span className="ad-studio-muted">The agent enters the approval queue automatically once it passes evaluation (stage 6 — Evaluated).</span>
          <div className="ad-gov-decision-actions">
            <button type="button" className="ad-studio-btn is-accent is-sm" onClick={() => navigate({ tab: 'evaluation', agentId: agent.id })}><FlaskConical size={13} /> Evaluation Center</button>
            <button type="button" className="ad-studio-btn is-ghost is-sm" onClick={() => navigate({ tab: 'agents', agentId: agent.id, view: 'onboarding' })}>Onboarding Studio</button>
          </div>
        </div>
      </div>
    </section>
  );
}
