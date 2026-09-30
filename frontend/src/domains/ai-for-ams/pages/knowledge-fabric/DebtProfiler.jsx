import React from 'react';
import { Play } from 'lucide-react';
import { useAmsNavigation } from '../../navigation/useAmsNavigation';
import { AMS_SUBPAGE } from '../../navigation/amsRoutes';

/**
 * Severity band of a debt index (higher is worse).
 *
 * @param {number} index 0–100.
 * @returns {{ className: string, label: string }}
 */
function debtBand(index) {
  if (index >= 70) return { className: 'badge-critical', label: 'High debt' };
  if (index >= 40) return { className: 'badge-high', label: 'Moderate debt' };
  return { className: 'badge-success', label: 'Low debt' };
}

/**
 * Debt profiler (F8): the debt index, the backlog items behind it (from the
 * dashboard's technical-debt backlog), the incident each one causes and the
 * agent that can remediate it.
 *
 * @param {Object} props
 * @param {{ index: number, costOfInaction: string, items: Object[] }} props.profile
 * @param {(incidentId: string) => void} props.onShowIncident
 * @returns {JSX.Element}
 */
export default function DebtProfiler({ profile, onShowIncident }) {
  const { goToSubPage } = useAmsNavigation();

  return (
    <section className="st-card ams-card" aria-labelledby="ams-debt-title">
      <div className="ams-page-header">
        <div>
          <h3 id="ams-debt-title" className="ams-card-title">Technical-debt profiler</h3>
          <p className="ams-card-subtitle">Root causes behind recurring incidents, weighted by size, priority and how often they recur. Cost of inaction: {profile.costOfInaction}.</p>
        </div>
        <div className="st-card ams-kpi ams-debt-index">
          <span className="ams-kpi-label">Debt index</span>
          <span className="ams-kpi-value">{profile.index}<small>/100</small></span>
          <span className={`st-badge ${debtBand(profile.index).className}`}>{debtBand(profile.index).label}</span>
        </div>
      </div>

      <div className="ams-table-wrap">
        <table className="ams-table">
          <thead>
            <tr>
              <th scope="col">Debt item</th>
              <th scope="col">Service</th>
              <th scope="col">Weight</th>
              <th scope="col">Causes</th>
              <th scope="col">Can be remediated by</th>
            </tr>
          </thead>
          <tbody>
            {profile.items.map((item) => (
              <tr key={item.id}>
                <td>
                  <span className="is-strong">{item.id}</span> {item.title}
                  <div className="is-small">{item.priority} · {item.storyPoints} SP · {item.recurringIncidents} recurring incidents · {item.status}</div>
                </td>
                <td>{item.service}</td>
                <td className="is-strong">{item.weight}</td>
                <td>
                  {item.incidentId
                    ? <button type="button" className="ams-link-button" onClick={() => onShowIncident(item.incidentId)}>{item.incidentId}</button>
                    : '—'}
                </td>
                <td>
                  {item.remediatingAgent ? (
                    <button
                      type="button"
                      className="st-btn st-btn-outline"
                      onClick={() => goToSubPage(AMS_SUBPAGE.HARNESS, {
                        agentId: item.remediatingAgent.id,
                        task: `Remediate ${item.id}: ${item.title} (${item.crLinked})`
                      })}
                    >
                      <Play size={13} /> {item.remediatingAgent.name}
                    </button>
                  ) : <span className="ams-muted-note">No onboarded agent yet</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
