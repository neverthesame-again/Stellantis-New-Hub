import React, { useState } from 'react';
import { Pause, Play, ArrowUp, ArrowDown } from 'lucide-react';
import { LIVE_REFRESH_MS, SPARK_POINTS, formatMetric, sampleMetric, useLiveTick } from './liveTelemetry';
import './adLiveTelemetry.css';

function Sparkline({ values, tone }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const w = 84;
  const h = 26;
  const pts = values.map((v, i) => [(i / (values.length - 1)) * w, h - 3 - ((v - min) / span) * (h - 6)]);
  const [lx, ly] = pts[pts.length - 1];
  return (
    <svg className={`ad-live-spark tone-${tone}`} width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lx} cy={ly} r="2.4" />
    </svg>
  );
}

/**
 * Strip of live-refreshing metric tiles.
 * @param {{ metrics: object[], title?: string, note?: string, refreshMs?: number }} props
 */
export default function AdLiveTelemetry({ metrics, title = 'Live telemetry', note, refreshMs = LIVE_REFRESH_MS }) {
  const [paused, setPaused] = useState(false);
  const tick = useLiveTick(refreshMs, paused);
  const updated = new Date(tick * refreshMs).toLocaleTimeString('en-GB');

  return (
    <section className="ad-live" aria-label={title}>
      <div className="ad-live-head">
        <span className={`ad-live-dot ${paused ? 'is-paused' : ''}`} aria-hidden="true" />
        <span className="ad-live-title">{title}</span>
        <span className="ad-live-note">
          {note ? `${note} · ` : ''}Live values refresh every {refreshMs / 1000} s
        </span>
        <span className="st-badge badge-purple ad-live-badge">Simulated telemetry</span>
        <span className="ad-live-updated">Updated {updated}</span>
        <button
          type="button"
          className="ad-live-toggle"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? 'Resume live updates' : 'Pause live updates'}
          title={paused ? 'Resume live updates' : 'Pause live updates'}
        >
          {paused ? <Play size={12} /> : <Pause size={12} />}
        </button>
      </div>

      <div className="ad-live-grid">
        {metrics.map((def) => {
          const Icon = def.icon;
          const series = Array.from({ length: SPARK_POINTS }, (_, i) => sampleMetric(def, tick - (SPARK_POINTS - 1 - i), refreshMs));
          const value = series[series.length - 1];
          const delta = value - series[series.length - 2];
          const better = delta === 0 ? 'flat' : (delta > 0) === (def.good !== 'down') ? 'good' : 'bad';
          const deltaText = formatMetric({ ...def, suffix: def.suffix?.trim().startsWith('/') ? '' : def.suffix }, Math.abs(delta));
          return (
            <div key={def.id} className="ad-live-tile">
              <div className="ad-live-tile-top">
                <span className="ad-live-label">{Icon && <Icon size={13} aria-hidden="true" />} {def.label}</span>
                <Sparkline values={series} tone={better} />
              </div>
              <div className="ad-live-value-row">
                <span key={tick} className="ad-live-value">{formatMetric(def, value)}</span>
                {delta !== 0 && (
                  <span className={`ad-live-delta is-${better}`}>
                    {delta > 0 ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
                    {deltaText}
                  </span>
                )}
              </div>
              <span className="ad-live-hint">{def.hint}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
