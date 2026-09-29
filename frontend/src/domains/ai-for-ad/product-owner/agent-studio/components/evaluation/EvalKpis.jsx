import React from 'react';
import { Gauge, Bot, SlidersHorizontal, TrendingDown, ShieldAlert, Rocket, Minus, Plus } from 'lucide-react';
import { THRESHOLD_MAX, THRESHOLD_MIN, clamp, scoreTone } from './evalUtils';

/** KPI strip with the live-editable pass threshold. */
export default function EvalKpis({ stats, threshold, onThreshold, onSelectReady }) {
  const setT = (n) => onThreshold(clamp(Math.round(n), THRESHOLD_MIN, THRESHOLD_MAX));
  const avgTone = scoreTone(stats.avgScore, threshold);

  return (
    <div className="ad-studio-kpi-grid ad-eval-kpis">
      <div className="ad-studio-kpi">
        <span className="ad-studio-kpi-label"><Gauge size={12} /> Platform average</span>
        <span className={`ad-studio-kpi-value ad-eval-tone-text is-${avgTone}`}>
          {stats.avgScore ?? '—'}<small>/100</small>
        </span>
        <div className={`ad-studio-progress is-${avgTone === 'good' ? 'good' : avgTone === 'warn' ? 'warn' : 'bad'}`}>
          <span style={{ width: `${stats.avgScore || 0}%` }} />
        </div>
        <span className="ad-studio-kpi-note">Mean score of {stats.evaluated} evaluated agent{stats.evaluated === 1 ? '' : 's'}</span>
      </div>

      <div className="ad-studio-kpi">
        <span className="ad-studio-kpi-label"><Bot size={12} /> Agents evaluated</span>
        <span className="ad-studio-kpi-value">{stats.evaluated}<small>/ {stats.total}</small></span>
        <span className="ad-studio-kpi-note">{stats.total - stats.evaluated} never evaluated · {stats.totalRuns} runs total</span>
      </div>

      <div className="ad-studio-kpi ad-eval-kpi-threshold">
        <span className="ad-studio-kpi-label"><SlidersHorizontal size={12} /> Pass threshold</span>
        <div className="ad-eval-stepper">
          <button type="button" className="ad-eval-stepper-btn" onClick={() => setT(threshold - 1)} disabled={threshold <= THRESHOLD_MIN} aria-label="Lower threshold">
            <Minus size={12} />
          </button>
          <span className="ad-studio-kpi-value">{threshold}</span>
          <button type="button" className="ad-eval-stepper-btn" onClick={() => setT(threshold + 1)} disabled={threshold >= THRESHOLD_MAX} aria-label="Raise threshold">
            <Plus size={12} />
          </button>
        </div>
        <input
          type="range"
          className="ad-eval-range"
          min={THRESHOLD_MIN}
          max={THRESHOLD_MAX}
          step={1}
          value={threshold}
          onChange={(e) => setT(Number(e.target.value))}
          aria-label="Pass threshold"
        />
        <span className="ad-studio-kpi-note">{THRESHOLD_MIN}–{THRESHOLD_MAX} · all scores recompute live</span>
      </div>

      <div className="ad-studio-kpi">
        <span className="ad-studio-kpi-label"><TrendingDown size={12} /> Below threshold</span>
        <span className={`ad-studio-kpi-value ${stats.failing ? 'ad-eval-tone-text is-bad' : ''}`}>{stats.failing}<small>/ {stats.evaluated}</small></span>
        <span className="ad-studio-kpi-note">Evaluated agents failing the gate</span>
      </div>

      <div className="ad-studio-kpi">
        <span className="ad-studio-kpi-label"><ShieldAlert size={12} /> Blocking violations</span>
        <span className={`ad-studio-kpi-value ${stats.violations ? 'ad-eval-tone-text is-bad' : ''}`}>{stats.violations}</span>
        <span className="ad-studio-kpi-note">Across {stats.violatingAgents} agent{stats.violatingAgents === 1 ? '' : 's'} · {stats.advisories} advisory</span>
      </div>

      <button type="button" className="ad-studio-kpi ad-eval-kpi-btn" onClick={onSelectReady} disabled={!stats.ready} title="Select the next agent waiting at the evaluation gate">
        <span className="ad-studio-kpi-label"><Rocket size={12} /> Ready for evaluation</span>
        <span className={`ad-studio-kpi-value ${stats.ready ? 'ad-eval-tone-text is-accent' : ''}`}>{stats.ready}</span>
        <span className="ad-studio-kpi-note">{stats.ready ? 'Workflow Mapped · click to open next' : 'No agent waiting at stage 5'}</span>
      </button>
    </div>
  );
}
