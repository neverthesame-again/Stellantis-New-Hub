import React from 'react';
import { ArrowRight, Database, Bot, CheckCircle, X, AlertTriangle, ExternalLink } from 'lucide-react';
import { AD_KNOWLEDGE_LANES, AD_SCENARIOS, RECORD_STATUS, getKnowledgeSource } from './model/adKnowledgeGraph';

export default function AdNodeDetailPanel({ record, agents, onShowScenario, onShowAgent, onOpenInStudio, onClose }) {
  const lane = AD_KNOWLEDGE_LANES.find((l) => l.id === record.lane);
  const status = RECORD_STATUS[record.status];
  const source = getKnowledgeSource(record.knowledgeSource);
  const isAgent = record.lane === 'agent';
  const agent = isAgent ? agents.find((a) => a.id === record.recordId) : null;
  const grounded = source ? agents.filter((a) => (a.knowledge || []).includes(source.id)) : [];

  return (
    <aside className="ad-kg-inspector" aria-label="Knowledge node details">
      <div className="ad-kg-inspector-header">
        <span className={`ad-kg-tag lane-${record.lane}`}>{lane?.label.toUpperCase()}</span>
        <button type="button" className="ad-kg-icon-btn" onClick={onClose} aria-label="Close details">
          <X size={14} />
        </button>
      </div>

      <div>
        <h3 className="ad-kg-inspector-title">{record.label}</h3>
        <div className="ad-kg-inspector-id">{record.recordId} · {lane?.process}</div>
      </div>

      {status && (
        <div className={`ad-kg-status-pill tone-${status.tone}`}>
          <span className={`ad-kg-status-dot tone-${status.tone}`} />
          {status.label} · {record.count}
        </div>
      )}

      <div className="ad-kg-inspector-section">
        <div className="ad-kg-sec-label">DESCRIPTION</div>
        <p className="ad-kg-sec-desc">{record.detail}</p>
      </div>

      {source && (
        <div className="ad-kg-inspector-section">
          <div className="ad-kg-sec-label">KNOWLEDGE SOURCE</div>
          <div className="ad-kg-source-card">
            <Database size={14} />
            <div>
              <div className="ad-kg-source-name">{source.name}</div>
              <div className="ad-kg-source-meta">{source.system} · {source.records.toLocaleString('en-US')} records · {source.category}</div>
            </div>
          </div>
        </div>
      )}

      <div className="ad-kg-inspector-section">
        <div className="ad-kg-sec-label">FEATURE THREADS</div>
        <div className="ad-kg-scenario-links">
          {record.scenarioIds.map((id) => (
            <button key={id} type="button" className="ad-kg-link-btn" onClick={() => onShowScenario(id)}>
              <span>{id} · {AD_SCENARIOS.find((s) => s.id === id)?.title}</span>
              <ArrowRight size={12} />
            </button>
          ))}
        </div>
      </div>

      {source && (
        <div className="ad-kg-inspector-section">
          <div className="ad-kg-sec-label">AGENTS GROUNDED IN THIS SOURCE</div>
          {grounded.length ? (
            <div className="ad-kg-bound-agents">
              {grounded.map((a) => (
                <button key={a.id} type="button" className="ad-kg-agent-item is-bound" onClick={() => onShowAgent(a.id)}>
                  <Bot size={13} />
                  <span className="ad-kg-agent-name">{a.name}</span>
                  <CheckCircle size={13} className="ad-kg-agent-check" />
                </button>
              ))}
            </div>
          ) : (
            <div className="ad-kg-warn-card">
              <AlertTriangle size={14} />
              <span>No agent is grounded in this source — automation gap.</span>
            </div>
          )}
        </div>
      )}

      {agent && (
        <div className="ad-kg-inspector-section">
          <div className="ad-kg-sec-label">AGENT</div>
          <div className="ad-kg-kv"><span>Owner</span><strong>{agent.owner}</strong></div>
          <div className="ad-kg-kv"><span>Team</span><strong>{agent.team}</strong></div>
          <div className="ad-kg-kv"><span>Governance</span><strong>{agent.governance?.status?.replace('_', ' ')}</strong></div>
          <div className="ad-kg-actions">
            <button type="button" className="ad-kg-action-btn" onClick={() => onShowAgent(agent.id)}>
              Show coverage <ArrowRight size={13} />
            </button>
            <button type="button" className="ad-kg-action-btn" onClick={() => onOpenInStudio(agent.id)}>
              Evaluation <ExternalLink size={13} />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
