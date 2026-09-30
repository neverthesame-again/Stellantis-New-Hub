import React from 'react';
import { Bot, CheckCircle, Circle, X, ArrowRight, ExternalLink } from 'lucide-react';
import { KNOWLEDGE_SOURCES } from '../agent-studio/agentStudioData';
import { AD_SCENARIOS } from './model/adKnowledgeGraph';

export default function AdAgentCoverageCard({ agent, graph, onShowScenario, onOpenInStudio, onClear }) {
  const bound = new Set(agent.knowledge || []);
  const percent = Math.round((bound.size / KNOWLEDGE_SOURCES.length) * 100);
  const threads = graph.nodes.find((n) => n.id === `agent:${agent.id}`)?.scenarioIds || [];

  return (
    <aside className="ad-kg-inspector" aria-label="Agent knowledge coverage">
      <div className="ad-kg-inspector-header">
        <span className="ad-kg-tag lane-agent">AGENT COVERAGE</span>
        <button type="button" className="ad-kg-icon-btn" onClick={onClear} aria-label="Clear agent highlight">
          <X size={14} />
        </button>
      </div>

      <div className="ad-kg-agent-head">
        <Bot size={20} />
        <div>
          <h3 className="ad-kg-inspector-title">{agent.name}</h3>
          <div className="ad-kg-inspector-id">{agent.family} · ASIL {agent.asil} · {agent.operationalState}</div>
        </div>
      </div>

      <div className={`ad-kg-coverage-box ${bound.size === 0 ? 'is-empty' : ''}`}>
        <div className="ad-kg-coverage-num">{percent}%</div>
        <div>
          <div className="ad-kg-coverage-title">SDLC knowledge coverage</div>
          <div className="ad-kg-coverage-sub">{bound.size} of {KNOWLEDGE_SOURCES.length} knowledge sources bound</div>
        </div>
      </div>

      <div className="ad-kg-inspector-section">
        <div className="ad-kg-sec-label">KNOWLEDGE SOURCES</div>
        <div className="ad-kg-sources-list">
          {KNOWLEDGE_SOURCES.map((ks) => (
            <div key={ks.id} className={`ad-kg-source-pill ${bound.has(ks.id) ? 'is-bound' : ''}`}>
              {bound.has(ks.id) ? <CheckCircle size={13} className="ok" /> : <Circle size={13} className="off" />}
              <span>{ks.name}</span>
              <em>{ks.category}</em>
            </div>
          ))}
        </div>
      </div>

      <div className="ad-kg-inspector-section">
        <div className="ad-kg-sec-label">FEATURE THREADS SUPPORTED</div>
        {threads.length ? (
          <div className="ad-kg-scenario-links">
            {threads.map((id) => (
              <button key={id} type="button" className="ad-kg-link-btn" onClick={() => onShowScenario(id)}>
                <span>{id} · {AD_SCENARIOS.find((s) => s.id === id)?.title}</span>
                <ArrowRight size={12} />
              </button>
            ))}
          </div>
        ) : (
          <p className="ad-kg-sec-desc">Not among the top agents for any feature thread yet.</p>
        )}
      </div>

      <div className="ad-kg-inspector-section">
        <div className="ad-kg-sec-label">PURPOSE</div>
        <p className="ad-kg-sec-desc">{agent.purpose}</p>
        <div className="ad-kg-actions">
          <button type="button" className="ad-kg-action-btn" onClick={() => onOpenInStudio(agent.id)}>
            Open in Evaluation Center <ExternalLink size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
}
