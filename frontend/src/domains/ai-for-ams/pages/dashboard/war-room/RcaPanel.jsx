import React, { useState } from 'react';
import { CircleCheck, CircleX, FileText, Gauge, Hourglass, RotateCcw, Send, TriangleAlert, Wrench } from 'lucide-react';
import { useAmsStudio } from '../../../state/useAmsStudio';
import { useAmsNavigation } from '../../../navigation/useAmsNavigation';
import { AMS_MAIN_TAB, AMS_SUBPAGE } from '../../../navigation/amsRoutes';
import { getIncidentEvidence } from '../../../model/incidents';
import { RCA_STATUS, ROOT_CAUSE_STEP, getResponseTiles } from '../../../model/incidentResponse';
import { formatDateTime } from '../../../utils/formatters';
import EvidenceModal from './EvidenceModal';

const EVIDENCE_ICON = { log: FileText, metric: Gauge, change: Wrench, 'known-error': TriangleAlert };

/**
 * RCA evidence and remediation hand-off (F5): root cause in plain words (once
 * the response reaches "Root cause found"), the evidence behind it — each
 * opening its source — the recommended fix, similar past incidents, and
 * Send to Workflow Inbox / Accept / Reject. Decisions taken in the inbox show
 * up here.
 *
 * @param {Object} props
 * @param {import('../../../model/incidents').AmsIncident} props.incident
 * @param {Object} props.response
 * @param {(message: string) => void} props.showToast
 * @returns {JSX.Element}
 */
export default function RcaPanel({ incident, response, showToast }) {
  const { actions } = useAmsStudio();
  const { goToTab, goToSubPage } = useAmsNavigation();
  const [openRecord, setOpenRecord] = useState(null);
  const revealed = response.step >= ROOT_CAUSE_STEP;
  const { rca } = response;

  if (!revealed) {
    return (
      <section className="st-card ams-card" aria-labelledby="ams-rca-title">
        <h3 id="ams-rca-title" className="ams-card-title">Root cause &amp; fix</h3>
        <p className="ams-empty">The root cause appears here once the response reaches “Root cause found”.</p>
      </section>
    );
  }

  const send = () => {
    actions.sendRcaToInbox(incident.id, getResponseTiles(incident, response).confidence);
    showToast('Fix sent to the Workflow Inbox for approval.');
  };
  const decide = (accept) => {
    actions.decideRca(incident.id, accept);
    showToast(accept ? 'Fix approved — the response can move to remediation.' : 'Fix rejected.');
  };

  return (
    <section className="st-card ams-card" aria-labelledby="ams-rca-title">
      <h3 id="ams-rca-title" className="ams-card-title">Root cause &amp; fix</h3>

      <div className="ams-callout is-info">
        <span><strong>Root cause:</strong> {incident.rootCause}</span>
      </div>

      <div>
        <p className="ams-section-title">Evidence</p>
        <ul className="ams-evidence-list">
          {getIncidentEvidence(incident).map((record) => {
            const Icon = EVIDENCE_ICON[record.evidenceType] ?? FileText;
            return (
              <li key={record.recordId}>
                <button type="button" className="ams-evidence-item" onClick={() => setOpenRecord(record)}>
                  <Icon size={14} aria-hidden="true" />
                  <span className="ams-evidence-text">
                    <strong>{record.system} · {record.recordId}</strong>
                    <span>{record.label}</span>
                  </span>
                  <span className="ams-muted-note">Open source</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <p className="ams-section-title">Recommended fix</p>
        <p className="ams-fix">{incident.fix}</p>
      </div>

      <div>
        <p className="ams-section-title">Similar past incidents</p>
        <ul className="ams-similar-list">
          {incident.knowledge.similar.map((past) => (
            <li key={past.id}>
              <span className="st-badge badge-success">{past.match}% match</span>
              <span><strong>{past.id}</strong> {past.title}</span>
              <span className="ams-muted-note">Resolved in {past.resolvedIn}: {past.resolution}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="ams-decision">
        {rca.status === RCA_STATUS.NONE && (
          <div className="ams-page-actions">
            <button type="button" className="st-btn st-btn-outline" onClick={send}><Send size={14} /> Send to Workflow Inbox</button>
            <button type="button" className="st-btn ams-btn-success" onClick={() => decide(true)}><CircleCheck size={14} /> Accept</button>
            <button type="button" className="st-btn st-btn-outline ams-btn-danger" onClick={() => decide(false)}><CircleX size={14} /> Reject</button>
          </div>
        )}
        {rca.status === RCA_STATUS.SENT && (
          <div className="ams-callout is-warning" role="status">
            <Hourglass size={16} aria-hidden="true" />
            <span>
              Waiting for a decision in the{' '}
              <button type="button" className="ams-link-button" onClick={() => goToTab(AMS_MAIN_TAB.INBOX)}>Workflow Inbox ({rca.inboxItemId})</button>.
              You can also decide here:{' '}
              <button type="button" className="ams-link-button" onClick={() => decide(true)}>accept</button> or{' '}
              <button type="button" className="ams-link-button" onClick={() => decide(false)}>reject</button>.
            </span>
          </div>
        )}
        {(rca.status === RCA_STATUS.ACCEPTED || rca.status === RCA_STATUS.REJECTED) && (
          <div className={`ams-callout ${rca.status === RCA_STATUS.ACCEPTED ? 'is-success' : 'is-warning'}`} role="status">
            {rca.status === RCA_STATUS.ACCEPTED ? <CircleCheck size={16} aria-hidden="true" /> : <CircleX size={16} aria-hidden="true" />}
            <span>
              Fix <strong>{rca.status === RCA_STATUS.ACCEPTED ? 'approved' : 'rejected'}</strong> by {rca.decidedBy}
              {' '}{rca.via === 'inbox' ? `in the Workflow Inbox (${rca.inboxItemId})` : 'in the war room'}, {formatDateTime(rca.decidedAt)}.
              {rca.status === RCA_STATUS.REJECTED && (
                <>{' '}<button type="button" className="ams-link-button" onClick={() => actions.reopenRca(incident.id)}><RotateCcw size={12} /> Reconsider</button></>
              )}
            </span>
          </div>
        )}
      </div>

      {openRecord && (
        <EvidenceModal
          record={openRecord}
          onClose={() => setOpenRecord(null)}
          onOpenInKnowledgeFabric={() => goToSubPage(AMS_SUBPAGE.KNOWLEDGE_FABRIC, { incidentId: incident.id })}
        />
      )}
    </section>
  );
}
