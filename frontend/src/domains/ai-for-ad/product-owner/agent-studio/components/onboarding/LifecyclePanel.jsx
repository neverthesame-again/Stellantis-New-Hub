import React, { useState } from 'react';
import {
  Milestone, CircleCheck, CircleX, ArrowRight, PlayCircle, Gauge, Scale, Rocket,
  History, ChevronDown, ChevronUp, CornerDownRight
} from 'lucide-react';
import LifecycleStepper from '../LifecycleStepper';
import { LIFECYCLE_STAGES, getStage, stageProgress, formatDateTime } from '../../agentStudioData';
import { exitChecklist, nextStageOf } from './onboardingHelpers';

/** Who owns which part of the 9-stage lifecycle (proportional phase strip). */
const PHASES = [
  { key: 'onb', label: 'Onboarding Studio', from: 1, to: 5 },
  { key: 'eval', label: 'Evaluation', from: 6, to: 6 },
  { key: 'gov', label: 'Governance', from: 7, to: 8 },
  { key: 'rt', label: 'AD Runtime', from: 9, to: 9 }
];

const AUDIT_TONE = { lifecycle: 'is-info', evaluation: 'is-purple', governance: 'is-warning', harness: 'is-success' };

/**
 * F2 — lifecycle tracker: current stage, progress, stepper, next-stage exit
 * criteria with live blockers, advance action, deep links and stage history.
 */
export default function LifecyclePanel({
  agent, blockers, threshold, audit, dirty, onAdvance, onPublish, onNavigate, onJump
}) {
  const [showAll, setShowAll] = useState(false);
  const current = getStage(agent.stage);
  const next = nextStageOf(agent);
  const pct = stageProgress(agent.stage);
  const checklist = exitChecklist(agent.stage, threshold);
  const unmatched = blockers.filter((b) => !checklist.some((c) => c.match.test(b)));
  const history = audit
    .filter((a) => a.agentId === agent.id)
    .sort((a, b) => Date.parse(b.ts) - Date.parse(a.ts));
  const shownHistory = showAll ? history : history.slice(0, 6);
  const isPublishStep = agent.stage === 8;

  return (
    <section className="ad-studio-card ad-onb-lifecycle" id="ad-onb-sec-lifecycle">
      <div className="ad-onb-lc-top">
        <div>
          <span className="ad-studio-eyebrow">Current stage · {agent.stage} of 9</span>
          <div className="ad-onb-lc-stage">
            <Milestone size={16} />
            <span>{current.label}</span>
            <span className="ad-studio-badge">{current.home}</span>
          </div>
          <div className="ad-studio-muted">{current.exit}</div>
        </div>
        <div className="ad-onb-lc-progress">
          <span className="ad-onb-lc-pct">{pct}<small>%</small></span>
          <span className="ad-studio-muted">lifecycle progress</span>
          <div className={`ad-studio-progress ${pct === 100 ? 'is-good' : ''}`}><span style={{ width: `${Math.max(pct, 3)}%` }} /></div>
        </div>
      </div>

      <LifecycleStepper stage={agent.stage} />

      <div className="ad-onb-phase-strip" aria-hidden="true">
        {PHASES.map((p) => {
          const span = p.to - p.from + 1;
          const state = agent.stage >= p.to ? 'is-done' : agent.stage + 1 >= p.from ? 'is-current' : '';
          return (
            <div key={p.key} className={`ad-onb-phase ${state}`} style={{ flex: span }}>
              <span>{p.label}</span>
              <small>{p.from === p.to ? `Stage ${p.from}` : `Stages ${p.from}–${p.to}`}</small>
            </div>
          );
        })}
      </div>

      <div className="ad-onb-lc-body">
        <div className="ad-onb-lc-next">
          {next ? (
            <>
              <div className="ad-onb-lc-next-head">
                <span className="ad-studio-label">Next stage</span>
                <strong>{next.id}. {next.label}</strong>
                <span className="ad-studio-badge">{LIFECYCLE_STAGES[next.id - 1].home}</span>
              </div>
              <p className="ad-onb-lc-exit">Exit criteria — {next.exit}</p>
              <ul className="ad-onb-checklist">
                {checklist.map((c) => {
                  const failing = blockers.some((b) => c.match.test(b));
                  return (
                    <li key={c.label} className={failing ? 'is-fail' : 'is-pass'}>
                      {failing ? <CircleX size={14} /> : <CircleCheck size={14} />}
                      <span>{c.label}</span>
                      {failing && c.jump && (
                        <button type="button" className="ad-onb-link" onClick={() => onJump(c.jump)}>Fix <CornerDownRight size={11} /></button>
                      )}
                      {failing && c.nav && (
                        <button type="button" className="ad-onb-link" onClick={() => onNavigate(c.nav)}>Open <ArrowRight size={11} /></button>
                      )}
                    </li>
                  );
                })}
                {unmatched.map((b) => (
                  <li key={b} className="is-fail"><CircleX size={14} /><span>{b}</span></li>
                ))}
              </ul>
              {blockers.length === 0 && (
                <div className="ad-onb-ready"><CircleCheck size={14} /> All exit criteria met — ready to advance.</div>
              )}
              <div className="ad-onb-lc-actions">
                {isPublishStep ? (
                  <button type="button" className="ad-studio-btn is-primary" onClick={onPublish}>
                    <Rocket size={13} /> Publish to AD runtime
                  </button>
                ) : (
                  <button
                    type="button"
                    className="ad-studio-btn is-primary"
                    onClick={onAdvance}
                    disabled={dirty}
                    title={dirty ? 'Save the registration before advancing' : undefined}
                  >
                    Advance to {next.label} <ArrowRight size={13} />
                  </button>
                )}
                {agent.stage >= 2 && (
                  <button type="button" className="ad-studio-btn is-accent" onClick={() => onNavigate('harness')}>
                    <PlayCircle size={13} /> Run in AI Harness
                  </button>
                )}
                {agent.stage === 5 && (
                  <button type="button" className="ad-studio-btn is-accent" onClick={() => onNavigate('evaluation')}>
                    <Gauge size={13} /> Evaluate in Evaluation Center
                  </button>
                )}
                {agent.stage >= 6 && agent.stage <= 8 && (
                  <button type="button" className="ad-studio-btn is-accent" onClick={() => onNavigate('governance')}>
                    <Scale size={13} /> Open in Governance Center
                  </button>
                )}
              </div>
              {dirty && !isPublishStep && <div className="ad-studio-muted ad-onb-hint">Unsaved changes — save the registration before advancing.</div>}
            </>
          ) : (
            <>
              <div className="ad-onb-ready"><Rocket size={14} /> Published — visible in the AI Studio and AD runtime.</div>
              <div className="ad-onb-lc-actions">
                <button type="button" className="ad-studio-btn is-accent" onClick={() => onNavigate('harness')}>
                  <PlayCircle size={13} /> Run in AI Harness
                </button>
                <button type="button" className="ad-studio-btn" onClick={() => onNavigate('evaluation')}>
                  <Gauge size={13} /> Re-evaluate
                </button>
              </div>
            </>
          )}
        </div>

        <div className="ad-onb-history">
          <div className="ad-onb-history-head">
            <span className="ad-studio-label"><History size={11} /> Stage history</span>
            <span className="ad-studio-muted">{history.length} events</span>
          </div>
          {history.length === 0 ? (
            <div className="ad-studio-empty">No lifecycle events recorded yet.</div>
          ) : (
            <ol className="ad-onb-timeline">
              {shownHistory.map((h) => (
                <li key={h.id}>
                  <span className={`ad-onb-tl-dot ${AUDIT_TONE[h.type] || ''}`} />
                  <div className="ad-onb-tl-body">
                    <div className="ad-onb-tl-head">
                      <strong>{h.action}</strong>
                      <span className="ad-onb-tl-time">{formatDateTime(h.ts)}</span>
                    </div>
                    {h.detail && <div className="ad-onb-tl-detail">{h.detail}</div>}
                    <div className="ad-onb-tl-actor">{h.actor}</div>
                  </div>
                </li>
              ))}
            </ol>
          )}
          {history.length > 6 && (
            <button type="button" className="ad-onb-link" onClick={() => setShowAll((v) => !v)}>
              {showAll ? <>Show fewer <ChevronUp size={11} /></> : <>Show all {history.length} <ChevronDown size={11} /></>}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
