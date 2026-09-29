import React from 'react';
import { Layers } from 'lucide-react';
import { scoreTone } from './evalUtils';

const ROW_H = 30;
const LABEL_W = 170;
const BAR_X0 = LABEL_W;
const BAR_W = 420;
const CHART_W = LABEL_W + BAR_W + 56;
const TOP = 22;

/** Aggregated dimensions across evaluated agents: tiles + horizontal SVG bar chart vs threshold. */
export default function PlatformAggregates({ aggregates, threshold, evaluatedCount }) {
  const chartH = TOP + aggregates.length * ROW_H + 20;
  const x = (v) => BAR_X0 + (BAR_W * v) / 100;
  const weakest = aggregates.filter((a) => a.avg !== null).sort((a, b) => a.avg - b.avg)[0];

  return (
    <section className="ad-studio-card ad-eval-agg">
      <div className="ad-studio-card-title">
        <h3><Layers size={13} /> Aggregated dimensions — platform</h3>
        <span className="ad-studio-muted">
          {evaluatedCount} evaluated agent{evaluatedCount === 1 ? '' : 's'}
          {weakest ? ` · weakest: ${weakest.label} (${weakest.avg})` : ''}
        </span>
      </div>

      {evaluatedCount === 0 ? (
        <div className="ad-studio-empty">No evaluated agents yet — run an evaluation to populate platform aggregates.</div>
      ) : (
        <div className="ad-eval-agg-layout">
          <div className="ad-eval-agg-tiles">
            {aggregates.map((d) => {
              const tone = scoreTone(d.avg, threshold);
              return (
                <div key={d.key} className="ad-eval-agg-tile" title={`${d.label} — ${d.description}`}>
                  <span className="ad-eval-agg-label">{d.label}</span>
                  <span className={`ad-eval-agg-value ad-eval-tone-text is-${tone}`}>{d.avg ?? '—'}</span>
                  <span className="ad-eval-dim-track is-slim">
                    <span className={`ad-eval-dim-fill is-${tone}`} style={{ width: `${d.avg || 0}%` }} />
                    <span className="ad-eval-dim-marker is-threshold" style={{ left: `${threshold}%` }} />
                  </span>
                  <span className="ad-eval-agg-meta">{d.n} agent{d.n === 1 ? '' : 's'} · range {d.min}–{d.max}</span>
                </div>
              );
            })}
          </div>

          <figure className="ad-eval-agg-chart">
            <svg viewBox={`0 0 ${CHART_W} ${chartH}`} role="img" aria-label="Average score per dimension compared with the pass threshold">
              {[0, 25, 50, 75, 100].map((t) => (
                <g key={t}>
                  <line className="ad-eval-hbar-grid" x1={x(t)} x2={x(t)} y1={TOP - 6} y2={chartH - 18} />
                  <text className="ad-eval-hbar-tick" x={x(t)} y={chartH - 5} textAnchor="middle">{t}</text>
                </g>
              ))}
              {aggregates.map((d, i) => {
                const y = TOP + i * ROW_H;
                const tone = scoreTone(d.avg, threshold);
                return (
                  <g key={d.key}>
                    <text className="ad-eval-hbar-label" x={LABEL_W - 10} y={y + 14} textAnchor="end">{d.label}</text>
                    <rect className="ad-eval-hbar-track" x={BAR_X0} y={y + 4} width={BAR_W} height={14} rx={4} />
                    <rect className={`ad-eval-hbar-fill is-${tone}`} x={BAR_X0} y={y + 4} width={Math.max(0, x(d.avg || 0) - BAR_X0)} height={14} rx={4}>
                      <title>{`${d.label}: avg ${d.avg} across ${d.n} agents (range ${d.min}–${d.max})`}</title>
                    </rect>
                    {d.min !== null && (
                      <line className="ad-eval-hbar-range" x1={x(d.min)} x2={x(d.max)} y1={y + 22} y2={y + 22}>
                        <title>{`Range ${d.min}–${d.max}`}</title>
                      </line>
                    )}
                    <text className={`ad-eval-hbar-value is-${tone}`} x={x(100) + 8} y={y + 15}>{d.avg}</text>
                  </g>
                );
              })}
              <line className="ad-eval-hbar-threshold" x1={x(threshold)} x2={x(threshold)} y1={TOP - 10} y2={chartH - 18} />
              <text className="ad-eval-hbar-threshold-label" x={x(threshold)} y={TOP - 12} textAnchor="middle">threshold {threshold}</text>
            </svg>
            <figcaption className="ad-eval-radar-legend">
              <span><i className="ad-eval-lg-threshold" /> Pass threshold</span>
              <span><i className="ad-eval-lg-range" /> Min–max across agents</span>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
