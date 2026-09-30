import React from 'react';
import { Clock, Gauge, TrendingDown, Users } from 'lucide-react';
import { RESOLVED_STEP, getResponseTiles } from '../../../model/incidentResponse';
import { formatElapsed } from '../../../utils/formatters';
import { useNow } from '../../../utils/useNow';

/**
 * The four live tiles of the war room (F4): time to resolve so far (ticking
 * until resolved), confidence, business impact and users affected.
 *
 * @param {Object} props
 * @param {import('../../../model/incidents').AmsIncident} props.incident
 * @param {Object} props.response Live response state.
 * @returns {JSX.Element}
 */
export default function IncidentTiles({ incident, response }) {
  const resolved = response.step >= RESOLVED_STEP;
  const now = useNow(1000, !resolved);
  const tiles = getResponseTiles(incident, response);
  const end = resolved ? new Date(response.resolvedAt).getTime() : now;
  const elapsed = formatElapsed(end - new Date(response.openedAt).getTime());

  const items = [
    { icon: Clock, label: resolved ? 'Time to resolve' : 'Time to resolve so far', value: elapsed, hint: resolved ? 'Resolved' : 'Running' },
    { icon: Gauge, label: 'Confidence', value: `${tiles.confidence}%`, hint: 'In the current diagnosis and plan' },
    { icon: TrendingDown, label: 'Business impact', value: tiles.impactPerHourK > 0 ? `€${tiles.impactPerHourK}k / hour` : 'None', hint: incident.impactDescription },
    { icon: Users, label: 'Users affected', value: tiles.usersAffected.toLocaleString('en-GB'), hint: `${incident.usersAffected.toLocaleString('en-GB')} at detection` }
  ];

  return (
    <div className="ams-kpi-row" aria-live="polite">
      {items.map(({ icon: Icon, label, value, hint }) => (
        <div key={label} className="st-card ams-kpi">
          <span className="ams-kpi-label"><Icon size={13} aria-hidden="true" /> {label}</span>
          <span className="ams-kpi-value">{value}</span>
          <span className="ams-muted-note">{hint}</span>
        </div>
      ))}
    </div>
  );
}
