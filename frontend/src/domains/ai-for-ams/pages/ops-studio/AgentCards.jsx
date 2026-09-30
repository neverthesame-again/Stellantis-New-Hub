import React from 'react';
import { Play, Wallet } from 'lucide-react';
import { useAmsNavigation } from '../../navigation/useAmsNavigation';
import { AMS_SUBPAGE } from '../../navigation/amsRoutes';
import { getAreaLabel, getRuntimeOption } from '../../model/agentOptions';
import { getCurrentStage } from '../../model/agentLifecycle';
import { getAgentReuseCount } from '../../model/runtimeModel';

/**
 * Compact AMS agent cards (F11): runtime badge, stage, skills count, reuse
 * count, and Run / Cost links.
 *
 * @param {Object} props
 * @param {Object[]} props.agents   Harness-eligible agents in scope.
 * @param {Object[]} props.workflows
 * @returns {JSX.Element}
 */
export default function AgentCards({ agents, workflows }) {
  const { goToSubPage } = useAmsNavigation();

  return (
    <div className="ams-grid" style={{ '--ams-grid-min': '250px' }}>
      {agents.map((agent) => (
        <article key={agent.id} className="st-card ams-card ams-mini-card">
          <div className="ams-card-head">
            <span className="st-badge badge-navy">{getRuntimeOption(agent.runtime?.type)?.shortLabel ?? 'Runtime'}</span>
            <span className="st-badge badge-purple">{getCurrentStage(agent).label}</span>
          </div>
          <div>
            <h4 className="ams-card-title">{agent.name}</h4>
            <p className="ams-card-subtitle">{getAreaLabel(agent.area)} · {agent.serviceTier || 'untiered'}</p>
          </div>
          <p className="ams-muted-note">
            {(agent.skillIds || []).length} skills · reused in {getAgentReuseCount(agent, workflows)} workflows
          </p>
          <div className="ams-card-actions">
            <button type="button" className="st-btn st-btn-primary is-grow" onClick={() => goToSubPage(AMS_SUBPAGE.HARNESS, { agentId: agent.id, autoRun: true })}>
              <Play size={13} /> Run
            </button>
            <button type="button" className="st-btn st-btn-outline" onClick={() => goToSubPage(AMS_SUBPAGE.MONITOR_FINOPS, { tab: 'cost', agentId: agent.id })} title="See this agent's cost">
              <Wallet size={13} /> Cost
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
