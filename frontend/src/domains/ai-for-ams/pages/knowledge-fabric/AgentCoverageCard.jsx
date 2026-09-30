import React from 'react';
import { CircleCheck, CircleX, Pencil } from 'lucide-react';
import { useAmsNavigation } from '../../navigation/useAmsNavigation';
import { AMS_SUBPAGE } from '../../navigation/amsRoutes';
import { getAreaLabel, getKnowledgeCoverage } from '../../model/agentOptions';
import RingGauge from '../../components/RingGauge';

/**
 * Knowledge coverage of one agent (F8): % of its area's recommended sources it
 * is bound to, with the bound and missing sources and every source it uses.
 *
 * @param {Object} props
 * @param {Object} props.agent Studio agent.
 * @returns {JSX.Element}
 */
export default function AgentCoverageCard({ agent }) {
  const { goToSubPage } = useAmsNavigation();
  const coverage = getKnowledgeCoverage(agent);

  return (
    <aside className="ams-inspector" aria-label={`${agent.name} knowledge coverage`}>
      <p className="ams-section-title">Knowledge coverage</p>
      <h3 className="ams-card-title">{agent.name}</h3>
      <p className="ams-muted-note">{getAreaLabel(agent.area)} · recommended sources for this area</p>
      <RingGauge value={coverage.percent} label="Coverage of recommended sources" />
      <ul className="ams-coverage-list">
        {coverage.bound.map((source) => (
          <li key={source} className="is-bound"><CircleCheck size={14} aria-label="Bound" /> {source}</li>
        ))}
        {coverage.missing.map((source) => (
          <li key={source} className="is-missing"><CircleX size={14} aria-label="Missing" /> {source}</li>
        ))}
      </ul>
      <p className="ams-muted-note">All sources bound: {(agent.knowledgeSources || []).join(', ') || 'none'}.</p>
      <button type="button" className="st-btn st-btn-outline" onClick={() => goToSubPage(AMS_SUBPAGE.AGENT_STUDIO, { tab: 'onboarding', agentId: agent.id })}>
        <Pencil size={14} /> Change sources in Agent Studio
      </button>
    </aside>
  );
}
