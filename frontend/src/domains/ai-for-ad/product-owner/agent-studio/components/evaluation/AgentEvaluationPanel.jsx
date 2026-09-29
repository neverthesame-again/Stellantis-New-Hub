import React from 'react';
import {
  Play, Loader2, CheckCircle2, XCircle, ShieldAlert, ShieldCheck, ArrowLeft, ArrowRight,
  Info, Radar, BarChart3, ListChecks, Clock, Gauge, AlertTriangle
} from 'lucide-react';
import LifecycleStepper from '../LifecycleStepper';
import { EVAL_DIMENSIONS, formatDateTime, getStage } from '../../agentStudioData';
import { applicableRules, dimensionLabel, dimensionMinimums, lifecycleNote, ruleMin, scoreTone } from './evalUtils';
import DimensionBars from './DimensionBars';
import RadarChart from './RadarChart';

function RunProgress({ step }) {
  const total = EVAL_DIMENSIONS.length;
  const pct = Math.round((Math.min(step, total) / total) * 100);
  return (
    <div className="ad-eval-running" role="status" aria-live="polite">
      <div className="ad-eval-running-head">
        <Loader2 size={14} className="ad-eval-spin" />
        <strong>Evaluating…</strong>
        <span>{step >= total ? 'Applying rules & lifecycle gate' : `Scoring ${EVAL_DIMENSIONS[step].label}`}</span>
        <span className="ad-eval-running-pct">{pct}%</span>
      </div>
      <div className="ad-studio-progress"><span style={{ width: `${pct}%` }} /></div>
      <div className="ad-eval-running-steps">
        {EVAL_DIMENSIONS.map((d, i) => (
          <span key={d.key} className={`ad-eval-running-step ${i < step ? 'is-done' : i === step ? 'is-current' : ''}`}>
            {i < step ? <CheckCircle2 size={10} /> : <span className="ad-eval-running-dot" />} {d.short}
          </span>
        ))}
      </div>
    </div>
  );
}

function RuleChip({ outcome, threshold }) {
  const { rule, min, actual, pass } = outcome;
  const cls = pass ? 'is-pass' : rule.blocking ? 'is-fail' : 'is-advisory';
  return (
    <span
      className={`ad-eval-rule-chip ${cls}`}
      title={`${rule.name} — ${rule.description}\n${dimensionLabel(rule.dimension)}: ${actual} vs min ${min}${rule.dimension === 'overall' ? ` (threshold ${threshold})` : ''} · ${rule.blocking ? 'blocking' : 'advisory'}`}
    >
      {pass ? <CheckCircle2 size={11} /> : rule.blocking ? <XCircle size={11} /> : <AlertTriangle size={11} />}
      <span className="ad-eval-rule-chip-name">{rule.name}</span>
      <span className="ad-eval-rule-chip-val">{actual}<em>/{min}</em></span>
    </span>
  );
}

export default function AgentEvaluationPanel({
  agent, summary, threshold, rules, running, runDisabled, onRun, onNavigate, platformDims
}) {
  if (!agent) {
    return (
      <section className="ad-studio-card ad-eval-panel">
        <div className="ad-studio-empty">Select an agent from the leaderboard to inspect its evaluation.</div>
      </section>
    );
  }

  const ev = agent.evaluation;
  const isRunning = running !== null && running !== undefined;
  const note = lifecycleNote(agent);
  const minimums = dimensionMinimums(agent, rules);
  const upcomingRules = applicableRules(agent, rules);
  const tone = scoreTone(summary.score, threshold);
  const stage = getStage(agent.stage);
  const failed = summary.evaluated && !summary.pass;

  const runButton = (label) => (
    <button type="button" className="ad-studio-btn is-primary" onClick={() => onRun(agent)} disabled={runDisabled}>
      {isRunning ? <Loader2 size={13} className="ad-eval-spin" /> : <Play size={13} />}
      {isRunning ? 'Evaluating…' : label}
    </button>
  );

  return (
    <section className="ad-studio-card ad-eval-panel">
      {/* ---------- identity ---------- */}
      <div className="ad-eval-panel-head">
        <div className="ad-eval-panel-id">
          <span className="ad-studio-eyebrow">Agent evaluation</span>
          <h3 className="ad-eval-panel-name">{agent.name}</h3>
          <p className="ad-eval-panel-meta">{agent.program} · {agent.team}</p>
          <div className="ad-eval-panel-tags">
            <span className={`ad-studio-badge ad-studio-asil asil-${agent.asil}`}>ASIL {agent.asil}</span>
            <span className="ad-studio-badge">{agent.subDomain}</span>
            <span className="ad-studio-badge is-mono">v{agent.version}</span>
            <span className="ad-studio-badge is-info">Stage {agent.stage} · {stage.label}</span>
            {agent.operationalState === 'Suspended' && <span className="ad-studio-badge is-warning">Suspended</span>}
          </div>
        </div>
        <div className="ad-eval-panel-score">
          {summary.evaluated ? (
            <>
              <span className={`ad-eval-score-ring is-${tone}`} style={{ '--pct': `${summary.score}%` }}>
                <strong>{summary.score}</strong>
                <small>/100</small>
              </span>
              {summary.pass
                ? <span className="ad-studio-badge is-success"><CheckCircle2 size={11} /> Passing</span>
                : <span className="ad-studio-badge is-critical"><XCircle size={11} /> Failing</span>}
            </>
          ) : (
            <span className="ad-eval-score-ring is-none"><strong>—</strong><small>not run</small></span>
          )}
        </div>
      </div>

      <div className="ad-eval-panel-strip">
        <LifecycleStepper stage={agent.stage} compact />
        <span className="ad-eval-panel-run-meta">
          <Clock size={12} /> Last run {ev ? formatDateTime(ev.lastRun) : '—'}
          <span className="ad-eval-dot-sep" />
          <Gauge size={12} /> {ev ? `${ev.runs} run${ev.runs === 1 ? '' : 's'}` : 'No runs yet'}
        </span>
        <div className="ad-eval-panel-actions">
          {ev && runButton('Run Evaluation')}
          {agent.stage >= 6 && (
            <button type="button" className="ad-studio-btn is-accent" onClick={() => onNavigate({ tab: 'governance', agentId: agent.id })}>
              <ShieldCheck size={13} /> Open in Governance <ArrowRight size={12} />
            </button>
          )}
          {failed && (
            <button type="button" className="ad-studio-btn is-danger" onClick={() => onNavigate({ tab: 'agents', agentId: agent.id, view: 'onboarding' })}>
              <ArrowLeft size={12} /> Back to Onboarding Studio
            </button>
          )}
        </div>
      </div>

      {isRunning && <RunProgress step={running} />}

      {/* ---------- lifecycle note ---------- */}
      <div className={`ad-eval-note is-${note.tone}`}>
        <Info size={14} />
        <div>
          <strong>{note.title}</strong>
          <p>{note.text}</p>
          {note.exit && <p className="ad-eval-note-exit">Exit criterion: {note.exit}</p>}
        </div>
      </div>

      {!ev ? (
        !isRunning && (
          <div className="ad-eval-empty">
            <div className="ad-eval-empty-icon"><Radar size={26} /></div>
            <h4>Not evaluated yet</h4>
            <p>
              Run the first evaluation to score {agent.name} on all {EVAL_DIMENSIONS.length} automotive quality
              dimensions against the pass threshold ({threshold}) and {upcomingRules.length} applicable rule{upcomingRules.length === 1 ? '' : 's'}.
            </p>
            {runButton('Run first evaluation')}
            {upcomingRules.length > 0 && (
              <div className="ad-eval-empty-rules">
                <span className="ad-studio-label">Rules that will apply</span>
                <div className="ad-eval-rule-chips">
                  {upcomingRules.map((r) => (
                    <span key={r.id} className="ad-eval-rule-chip is-neutral" title={r.description}>
                      {r.blocking ? <ShieldAlert size={11} /> : <AlertTriangle size={11} />}
                      <span className="ad-eval-rule-chip-name">{r.name}</span>
                      <span className="ad-eval-rule-chip-val"><em>min</em> {ruleMin(r, threshold)}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      ) : (
        <div className={isRunning ? 'ad-eval-dimmed' : ''}>
          {/* ---------- rules ---------- */}
          {summary.blocking.length > 0 && (
            <div className="ad-eval-violation" role="alert">
              <ShieldAlert size={16} />
              <div>
                <strong>{summary.blocking.length} blocking violation{summary.blocking.length === 1 ? '' : 's'} — agent cannot pass the evaluation gate</strong>
                <ul>
                  {summary.blocking.map((o) => (
                    <li key={o.rule.id}>
                      <b>{o.rule.name}</b>: {dimensionLabel(o.rule.dimension)} {o.actual} &lt; {o.min}
                      <span> (short by {Math.round((o.min - o.actual) * 10) / 10})</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {summary.blocking.length === 0 && summary.advisory.length > 0 && (
            <div className="ad-eval-advisory">
              <AlertTriangle size={14} />
              <span>{summary.advisory.length} advisory rule{summary.advisory.length === 1 ? '' : 's'} below minimum (non-blocking): {summary.advisory.map((o) => o.rule.name).join(', ')}</span>
            </div>
          )}

          <div className="ad-eval-section">
            <div className="ad-eval-section-title">
              <h4><ListChecks size={13} /> Applicable rules</h4>
              <span className="ad-studio-muted">
                {summary.outcomes.filter((o) => o.pass).length}/{summary.outcomes.length} satisfied
              </span>
            </div>
            {summary.outcomes.length ? (
              <div className="ad-eval-rule-chips">
                {summary.outcomes.map((o) => <RuleChip key={o.rule.id} outcome={o} threshold={threshold} />)}
              </div>
            ) : (
              <div className="ad-studio-muted">No enabled rules apply to this agent.</div>
            )}
          </div>

          {/* ---------- dimensions + radar ---------- */}
          <div className="ad-eval-viz">
            <div className="ad-eval-section">
              <div className="ad-eval-section-title">
                <h4><BarChart3 size={13} /> Dimension scores</h4>
                <span className="ad-studio-muted">▎ = rule minimum</span>
              </div>
              <DimensionBars dims={ev.dims} minimums={minimums} threshold={threshold} />
            </div>
            <div className="ad-eval-section">
              <div className="ad-eval-section-title">
                <h4><Radar size={13} /> Quality radar</h4>
                <span className="ad-studio-muted">hover for values</span>
              </div>
              <RadarChart dims={ev.dims} threshold={threshold} platformDims={platformDims} agentName={agent.name} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
