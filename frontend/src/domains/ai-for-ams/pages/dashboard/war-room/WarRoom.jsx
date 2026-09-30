import React from 'react';
import { ArrowRight, Check, Network } from 'lucide-react';
import { useAmsStudio } from '../../../state/useAmsStudio';
import { useAmsNavigation } from '../../../navigation/useAmsNavigation';
import { AMS_SUBPAGE } from '../../../navigation/amsRoutes';
import { AMS_INCIDENTS } from '../../../model/incidents';
import { RESOLVED_STEP, RESPONSE_STEPS, canAdvanceResponse } from '../../../model/incidentResponse';
import { formatDateTime } from '../../../utils/formatters';
import FilterPills from '../../../components/FilterPills';
import IncidentTiles from './IncidentTiles';
import RcaPanel from './RcaPanel';
import ResponseTimeline from './ResponseTimeline';

const SEVERITY_BADGE = { P1: 'badge-critical', P2: 'badge-high', P3: 'badge-info', P4: 'badge-info' };

/**
 * Live incident war room (F4 + F5): the incident being worked right now, its
 * live tiles, the agent collaboration timeline, "Advance response" and the
 * root-cause / fix hand-off. A picker switches between open incidents.
 *
 * @param {Object} props
 * @param {string | null} props.incidentId          Selected incident; the first open one when null.
 * @param {(incidentId: string) => void} props.onSelectIncident
 * @param {(message: string) => void} props.showToast
 * @returns {JSX.Element}
 */
export default function WarRoom({ incidentId, onSelectIncident, showToast }) {
  const { state, actions } = useAmsStudio();
  const { goToSubPage } = useAmsNavigation();

  const incident = AMS_INCIDENTS.find((candidate) => candidate.id === incidentId)
    ?? AMS_INCIDENTS.find((candidate) => state.incidentResponses[candidate.id]?.step < RESOLVED_STEP)
    ?? AMS_INCIDENTS[0];
  const response = state.incidentResponses[incident.id];
  const step = RESPONSE_STEPS[response.step];
  const { allowed, reason } = canAdvanceResponse(response);
  const nextStep = RESPONSE_STEPS[response.step + 1];

  const pickerOptions = AMS_INCIDENTS.map((candidate) => ({
    id: candidate.id,
    label: `${candidate.id} · ${candidate.severity} · ${RESPONSE_STEPS[state.incidentResponses[candidate.id].step].status}`
  }));

  const advance = () => {
    actions.advanceIncidentResponse(incident.id);
    showToast(`${incident.id}: ${nextStep.status}.`);
  };

  return (
    <div className="ams-page">
      <FilterPills options={pickerOptions} value={incident.id} onChange={onSelectIncident} ariaLabel="Open incidents" label="Incident" />

      <section className="st-card ams-card ams-incident-header" aria-labelledby="ams-incident-title">
        <div className="ams-page-header">
          <div>
            <div className="ams-badge-row">
              <span className="st-badge badge-navy">{incident.id}</span>
              <span className={`st-badge ${SEVERITY_BADGE[incident.severity]}`}>{incident.severity}</span>
              <span className={`st-badge ${response.step >= RESOLVED_STEP ? 'badge-success' : 'badge-purple'}`}>{step.status}</span>
              {response.step < RESOLVED_STEP && <span className="pulse-dot" aria-hidden="true" />}
            </div>
            <h2 id="ams-incident-title" className="ams-page-title">{incident.title}</h2>
            <p className="ams-card-subtitle">
              {incident.service} · {incident.portfolio} · opened {formatDateTime(response.openedAt)} · problem {incident.problemRecordId}
            </p>
          </div>
          <div className="ams-page-actions">
            <button type="button" className="st-btn st-btn-outline" onClick={() => goToSubPage(AMS_SUBPAGE.KNOWLEDGE_FABRIC, { incidentId: incident.id })}>
              <Network size={14} /> Knowledge page
            </button>
            {nextStep && (
              <button type="button" className="st-btn st-btn-primary" onClick={advance} disabled={!allowed} title={reason ?? undefined}>
                Advance response <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
        {!allowed && response.step < RESOLVED_STEP && <p className="ams-muted-note">{reason}</p>}
        <span className="st-badge badge-purple ams-simulated-note">Simulated response — “Advance response” plays the next step</span>
      </section>

      <IncidentTiles incident={incident} response={response} />

      <ol className="ams-steps ams-response-steps" aria-label="Response progress">
        {RESPONSE_STEPS.map((candidate, index) => {
          const status = index < response.step || response.step === RESOLVED_STEP ? 'is-done' : index === response.step ? 'is-current' : 'is-upcoming';
          return (
            <li key={candidate.id} className={`ams-step ${status}`} aria-current={index === response.step ? 'step' : undefined}>
              <span className="ams-step-dot" aria-hidden="true">{status === 'is-done' ? <Check size={13} strokeWidth={3} /> : index + 1}</span>
              <span className="ams-step-label">{candidate.status}</span>
            </li>
          );
        })}
      </ol>

      <div className="ams-war-room-grid">
        <section className="st-card ams-card" aria-labelledby="ams-timeline-title">
          <h3 id="ams-timeline-title" className="ams-card-title">Agent collaboration</h3>
          <ResponseTimeline entries={response.timeline} />
        </section>
        <RcaPanel key={incident.id} incident={incident} response={response} showToast={showToast} />
      </div>
    </div>
  );
}
