import React, { useMemo, useState } from 'react';
import {
  Bot, LayoutTemplate, Hammer, ArrowRight, CircleCheck, Circle, Target, Rocket, Workflow, ChevronRight, Sparkles
} from 'lucide-react';
import { WORKFLOWS, formatDateTime } from '../../agentStudioData';
import LifecycleStepper from '../LifecycleStepper';
import { useAgentStudio } from '../../useAgentStudio';
import {
  HARNESS_TEMPLATES, RELEASE_RECOMMENDATIONS, bestAgentFor, isHarnessReady, runtimeLabel
} from './harnessUtils';

const PRIORITY_CLS = { Critical: 'is-critical', High: 'is-warning', Medium: 'is-info' };

export default function HarnessQuickStart({ agents, runs, onOpenSingle, onNavigate }) {
  const [showTemplates, setShowTemplates] = useState(false);
  const { openWorkflow } = useAgentStudio();
  const ready = useMemo(() => agents.filter(isHarnessReady), [agents]);

  const journey = [
    {
      key: 'verify',
      title: 'Verify agents',
      text: 'At least one agent runtime connected and health-checked.',
      done: agents.some((a) => a.runtime.status === 'connected'),
      metric: `${agents.filter((a) => a.runtime.status === 'connected').length}/${agents.length} runtimes connected`,
      action: { label: 'Onboarding Studio', fn: () => onNavigate({ tab: 'agents', view: 'onboarding' }) }
    },
    {
      key: 'run',
      title: 'Single harness run',
      text: 'Complete one governed 10-step harness run end-to-end.',
      done: runs.some((r) => r.status === 'completed'),
      metric: `${runs.filter((r) => r.status === 'completed').length} completed run(s)`,
      action: { label: 'Open harness', fn: () => onOpenSingle(ready[0]?.id) }
    },
    {
      key: 'evaluate',
      title: 'Evaluate',
      text: 'Score an agent against the 8 AD dimensions and blocking rules.',
      done: agents.some((a) => Boolean(a.evaluation)),
      metric: `${agents.filter((a) => a.evaluation).length} evaluated agent(s)`,
      action: { label: 'Evaluation Center', fn: () => onNavigate({ tab: 'evaluation' }) }
    },
    {
      key: 'govern',
      title: 'Govern',
      text: 'Record an ISO 26262 / R155 approval decision.',
      done: agents.some((a) => a.governance?.status === 'approved'),
      metric: `${agents.filter((a) => a.governance?.status === 'approved').length} approved agent(s)`,
      action: { label: 'Governance Center', fn: () => onNavigate({ tab: 'governance' }) }
    }
  ];
  const journeyDone = journey.filter((j) => j.done).length;

  const templates = WORKFLOWS.map((wf) => {
    const mapped = agents.filter((a) => a.workflows.includes(wf.id));
    const first = mapped.find(isHarnessReady) || null;
    return { wf, meta: HARNESS_TEMPLATES[wf.id], mapped, first };
  });

  return (
    <div className="ad-hrn-quick">
      {/* Entry cards */}
      <div className="ad-hrn-entry-grid">
        <button type="button" className="ad-hrn-entry" onClick={() => onOpenSingle(ready[0]?.id)}>
          <span className="ad-hrn-entry-icon is-accent"><Bot size={20} /></span>
          <span className="ad-hrn-entry-title">Run single agent</span>
          <span className="ad-hrn-entry-text">Pick one onboarded AD agent, give it a task and watch the 10-step governed pipeline execute.</span>
          <span className="ad-hrn-entry-cta">{ready.length} agents ready <ArrowRight size={13} /></span>
        </button>
        <button
          type="button"
          className={`ad-hrn-entry ${showTemplates ? 'is-open' : ''}`}
          onClick={() => setShowTemplates((v) => !v)}
          aria-expanded={showTemplates}
        >
          <span className="ad-hrn-entry-icon is-violet"><LayoutTemplate size={20} /></span>
          <span className="ad-hrn-entry-title">Use a template</span>
          <span className="ad-hrn-entry-text">Start from an AD agentic workflow — Requirement → Test, Radar Fusion Triage, Release 4.2 Readiness…</span>
          <span className="ad-hrn-entry-cta">{showTemplates ? 'Hide templates' : `${WORKFLOWS.length} templates`} <ChevronRight size={13} className={showTemplates ? 'ad-hrn-rot90' : ''} /></span>
        </button>
        <button
          type="button"
          className="ad-hrn-entry"
          onClick={() => openWorkflow({ create: true })}
        >
          <span className="ad-hrn-entry-icon is-muted"><Hammer size={20} /></span>
          <span className="ad-hrn-entry-title">Build from scratch</span>
          <span className="ad-hrn-entry-text">Compose a multi-agent graph with hand-offs, policy gates and human approvals in the AI Studio playground.</span>
          <span className="ad-hrn-entry-cta">Open playground <ArrowRight size={13} /></span>
        </button>
      </div>

      {showTemplates && (
        <div className="ad-studio-card">
          <div className="ad-studio-card-title">
            <h3><Workflow size={14} /> AD workflow templates</h3>
            <span className="ad-studio-muted">Each template runs its first harness-ready agent with a pre-filled task</span>
          </div>
          <div className="ad-hrn-template-grid">
            {templates.map(({ wf, meta, mapped, first }) => (
              <div key={wf.id} className="ad-hrn-template">
                <div className="ad-hrn-template-head">
                  <strong>{wf.name}</strong>
                  <span className="ad-studio-badge is-mono">{meta?.steps.length || 0} steps</span>
                </div>
                <p>{meta?.description}</p>
                <div className="ad-hrn-template-steps">
                  {(meta?.steps || []).map((s, i) => (
                    <React.Fragment key={s}>
                      <span>{s}</span>
                      {i < meta.steps.length - 1 && <ChevronRight size={10} />}
                    </React.Fragment>
                  ))}
                </div>
                <div className="ad-hrn-template-agents">
                  <span className="ad-studio-label">Mapped agents</span>
                  {mapped.length === 0 && <span className="ad-studio-muted">No agent mapped yet</span>}
                  {mapped.map((a) => (
                    <span key={a.id} className={`ad-studio-badge ${isHarnessReady(a) ? 'is-info' : ''}`} title={isHarnessReady(a) ? 'Harness-ready' : 'Not harness-ready'}>
                      {a.name}
                    </span>
                  ))}
                </div>
                <div className="ad-hrn-template-foot">
                  <span className="ad-hrn-template-task">“{meta?.task}”</span>
                  <button
                    type="button"
                    className="ad-studio-btn is-primary is-sm"
                    disabled={!first}
                    title={first ? `Run ${first.name}` : 'No harness-ready agent mapped'}
                    onClick={() => onOpenSingle(first.id, meta?.task)}
                  >
                    <Rocket size={12} /> Run first agent
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="ad-hrn-quick-grid">
        {/* Program journey */}
        <div className="ad-studio-card">
          <div className="ad-studio-card-title">
            <h3><Target size={14} /> Program journey</h3>
            <span className="ad-studio-badge is-mono">{journeyDone}/4 complete</span>
          </div>
          <div className="ad-studio-progress is-good" style={{ marginBottom: 12 }}>
            <span style={{ width: `${(journeyDone / 4) * 100}%` }} />
          </div>
          <ol className="ad-hrn-journey">
            {journey.map((j, i) => (
              <li key={j.key} className={`ad-hrn-journey-step ${j.done ? 'is-done' : ''}`}>
                <span className="ad-hrn-journey-dot">{j.done ? <CircleCheck size={16} /> : <Circle size={16} />}</span>
                <div className="ad-hrn-journey-body">
                  <div className="ad-hrn-journey-title">
                    <span className="ad-hrn-mono">{i + 1}.</span> {j.title}
                    <span className={`ad-studio-badge ${j.done ? 'is-success' : ''}`}>{j.done ? 'Done' : 'Open'}</span>
                  </div>
                  <div className="ad-hrn-journey-text">{j.text}</div>
                  <div className="ad-hrn-journey-foot">
                    <span className="ad-studio-muted">{j.metric}</span>
                    <button type="button" className="ad-studio-btn is-ghost is-sm" onClick={j.action.fn}>
                      {j.action.label} <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Recommendations */}
        <div className="ad-studio-card">
          <div className="ad-studio-card-title">
            <h3><Sparkles size={14} /> Recommended for Release 4.2</h3>
          </div>
          <div className="ad-hrn-rec-list">
            {RELEASE_RECOMMENDATIONS.map((rec) => {
              const agent = bestAgentFor(agents, rec);
              return (
                <div key={rec.id} className="ad-hrn-rec">
                  <div className="ad-hrn-rec-head">
                    <span className={`ad-studio-badge ${PRIORITY_CLS[rec.priority]}`}>{rec.priority}</span>
                    <strong>{rec.title}</strong>
                  </div>
                  <div className="ad-studio-muted">{rec.why}</div>
                  <div className="ad-hrn-rec-foot">
                    {agent ? (
                      <span className="ad-hrn-rec-agent">
                        <Bot size={12} /> Best fit: <strong>{agent.name}</strong>
                        <span className={`ad-studio-badge ad-studio-asil asil-${agent.asil}`}>ASIL {agent.asil}</span>
                      </span>
                    ) : (
                      <span className="ad-studio-muted">No harness-ready agent fits yet</span>
                    )}
                    <button
                      type="button"
                      className="ad-studio-btn is-accent is-sm"
                      disabled={!agent}
                      onClick={() => onOpenSingle(agent.id, rec.task)}
                    >
                      Run <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ready agents */}
      <div className="ad-studio-card">
        <div className="ad-studio-card-title">
          <h3><Bot size={14} /> Agents ready for harness</h3>
          <span className="ad-studio-badge is-info">{ready.length} ready</span>
        </div>
        {ready.length === 0 ? (
          <div className="ad-studio-empty">No agent is harness-ready. Verify a runtime in the Onboarding Studio first.</div>
        ) : (
          <div className="ad-hrn-ready-grid">
            {ready.map((a) => {
              const last = runs.find((r) => r.agentId === a.id);
              return (
                <div key={a.id} className="ad-hrn-ready">
                  <div className="ad-hrn-ready-head">
                    <strong>{a.name}</strong>
                    <span className={`ad-studio-badge ad-studio-asil asil-${a.asil}`}>ASIL {a.asil}</span>
                  </div>
                  <div className="ad-studio-agent-item-tags">
                    <span className="ad-studio-badge is-mono">{runtimeLabel(a.runtime.type)}</span>
                    <span className="ad-studio-badge">{a.subDomain}</span>
                    <span className="ad-studio-badge">{a.operationalState}</span>
                  </div>
                  <LifecycleStepper stage={a.stage} compact />
                  <div className="ad-hrn-ready-foot">
                    <span className="ad-studio-muted">{last ? `Last run ${formatDateTime(last.startedAt)}` : 'Never run in harness'}</span>
                    <button type="button" className="ad-studio-btn is-sm" onClick={() => onOpenSingle(a.id)}>
                      Open in harness <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
