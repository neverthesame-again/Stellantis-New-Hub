import React from 'react';
import { AlertOctagon, ArrowRight, Cpu, AlertTriangle } from 'lucide-react';

export default function AdDebtProfiler({ profile, onShowScenario, onShowAgent }) {
  return (
    <section className="ad-kg-debt-section" aria-label="SDLC traceability debt">
      <div className="ad-kg-debt-header">
        <div className="ad-kg-title-area">
          <div className="ad-kg-debt-badge">
            <AlertOctagon size={16} />
          </div>
          <div>
            <h3 className="ad-kg-debt-title">Traceability & Knowledge Debt</h3>
            <p className="ad-kg-debt-sub">Broken V-model links and ungrounded agents that block the next release gate</p>
          </div>
        </div>
        <div className="ad-kg-debt-kpis">
          <div className="ad-kg-debt-kpi">
            <span className="ad-kg-kpi-val">{profile.index}/100</span>
            <span className="ad-kg-kpi-lbl">TRACE DEBT INDEX</span>
          </div>
          <div className="ad-kg-debt-kpi">
            <span className="ad-kg-kpi-val" style={{ color: '#f59e0b' }}>{profile.gaps}</span>
            <span className="ad-kg-kpi-lbl">OPEN TRACE GAPS</span>
          </div>
          <div className="ad-kg-debt-kpi">
            <span className="ad-kg-kpi-val" style={{ color: 'var(--text-primary)' }}>{profile.items.length}</span>
            <span className="ad-kg-kpi-lbl">DEBT ITEMS</span>
          </div>
        </div>
      </div>

      <div className="ad-kg-debt-grid">
        {profile.items.map((item) => (
          <div key={item.id} className="ad-kg-debt-card">
            <div className="ad-kg-debt-card-top">
              <span className={`ad-kg-priority-badge pri-${item.priority.toLowerCase()}`}>{item.priority}</span>
              <span className="ad-kg-severity-tag">{item.severity}</span>
            </div>

            <h4 className="ad-kg-debt-card-title">{item.title}</h4>

            <div className="ad-kg-debt-card-meta">
              <span>{item.area}</span>
              <span className="ad-kg-dot">•</span>
              <span className="ad-kg-debt-cost">{item.costOfInaction}</span>
            </div>

            <div className="ad-kg-debt-card-footer">
              <div className={`ad-kg-assigned-agent ${item.recommendedAgent ? '' : 'is-missing'}`}>
                {item.recommendedAgent ? <Cpu size={13} /> : <AlertTriangle size={13} />}
                <span>{item.recommendedAgent || (item.agentLinked ? 'Bind knowledge in Onboarding Studio' : 'No agent grounded — onboard one')}</span>
              </div>
              {item.scenarioLinked && (
                <button type="button" className="ad-kg-action-btn" onClick={() => onShowScenario(item.scenarioLinked)}>
                  Trace <ArrowRight size={13} />
                </button>
              )}
              {item.agentLinked && (
                <button type="button" className="ad-kg-action-btn" onClick={() => onShowAgent(item.agentLinked)}>
                  Agent <ArrowRight size={13} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
