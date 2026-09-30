import React, { useState } from 'react';
import { Hourglass, Loader2, Play } from 'lucide-react';
import { useAmsNavigation } from '../../../../navigation/useAmsNavigation';
import { AMS_MAIN_TAB } from '../../../../navigation/amsRoutes';
import { AMS_INCIDENTS } from '../../../../model/incidents';
import { RUN_STATUS } from '../../../../model/runModel';
import RunLog from '../../../../components/RunLog';
import RunStatusBadge from '../../../../components/RunStatusBadge';
import RunStepList from '../../../../components/RunStepList';

/**
 * Runs a saved workflow on an open incident and shows its latest run.
 *
 * @param {Object} props
 * @param {import('../../../../model/runModel').AmsRun | null} props.run  Latest run of this workflow.
 * @param {number | null} props.revealedCount                          Steps revealed while it animates.
 * @param {string | null} props.disabledReason                         Why running is not possible now.
 * @param {boolean} props.busy
 * @param {(incidentId: string) => void} props.onRun
 * @returns {JSX.Element}
 */
export default function WorkflowRunPanel({ run, revealedCount, disabledReason, busy, onRun }) {
  const { goToTab } = useAmsNavigation();
  const [incidentId, setIncidentId] = useState(AMS_INCIDENTS[0].id);
  const status = revealedCount !== null ? RUN_STATUS.RUNNING : run?.status;

  return (
    <section className="st-card ams-card" aria-labelledby="ams-flow-run-title">
      <div className="ams-toolbar">
        <h3 id="ams-flow-run-title" className="ams-card-title">Run on an incident</h3>
        <div className="ams-inline-form">
          <select className="ams-input" value={incidentId} onChange={(event) => setIncidentId(event.target.value)} aria-label="Incident">
            {AMS_INCIDENTS.map((incident) => (
              <option key={incident.id} value={incident.id}>{incident.id} · {incident.severity} · {incident.title}</option>
            ))}
          </select>
          <button
            type="button"
            className="st-btn st-btn-primary"
            onClick={() => onRun(incidentId)}
            disabled={Boolean(disabledReason) || busy}
            title={disabledReason ?? undefined}
          >
            {busy ? <Loader2 size={14} className="ams-spin" /> : <Play size={14} />} Run
          </button>
        </div>
      </div>
      {disabledReason && <p className="ams-muted-note">{disabledReason}</p>}

      {run ? (
        <>
          <div className="ams-badge-row">
            <RunStatusBadge status={status} />
            <span className="st-badge badge-info">{run.id}</span>
            <span className="ams-muted-note">{run.title}</span>
          </div>
          {revealedCount === null && run.status === RUN_STATUS.AWAITING_APPROVAL && (
            <div className="ams-callout is-warning" role="status">
              <Hourglass size={16} aria-hidden="true" />
              <span>
                Paused at a human approval gate ({run.approvalInboxItemId}). Decide in the{' '}
                <button type="button" className="ams-link-button" onClick={() => goToTab(AMS_MAIN_TAB.INBOX)}>Workflow Inbox</button>.
              </span>
            </div>
          )}
          <div className="ams-run-layout">
            <RunStepList run={run} revealedCount={revealedCount} />
            <RunLog run={run} revealedCount={revealedCount} />
          </div>
        </>
      ) : (
        <p className="ams-muted-note">This workflow has not been run yet.</p>
      )}
    </section>
  );
}
