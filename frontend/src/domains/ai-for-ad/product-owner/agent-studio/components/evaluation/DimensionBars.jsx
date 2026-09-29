import React from 'react';
import { EVAL_DIMENSIONS } from '../../agentStudioData';
import { scoreTone } from './evalUtils';

/**
 * 8 dimension bars (0–100). Each bar shows the value, a marker for the
 * highest applicable rule minimum on that dimension, and the dimension
 * description on hover.
 */
export default function DimensionBars({ dims, minimums, threshold }) {
  return (
    <div className="ad-eval-dims">
      {EVAL_DIMENSIONS.map((d) => {
        const value = dims[d.key];
        const rule = minimums[d.key];
        const tone = rule ? (value >= rule.min ? 'good' : rule.blocking ? 'bad' : 'warn') : scoreTone(value, threshold);
        return (
          <div key={d.key} className="ad-eval-dim" title={`${d.label} — ${d.description}`}>
            <div className="ad-eval-dim-head">
              <span className="ad-eval-dim-label">{d.label}</span>
              <span className={`ad-eval-dim-value is-${tone}`}>{value}</span>
            </div>
            <div className="ad-eval-dim-track">
              <span className={`ad-eval-dim-fill is-${tone}`} style={{ width: `${value}%` }} />
              {rule && (
                <span
                  className={`ad-eval-dim-marker ${rule.blocking ? 'is-blocking' : ''}`}
                  style={{ left: `${rule.min}%` }}
                  title={`Rule minimum ${rule.min} — ${rule.rules.join(', ')}${rule.blocking ? ' (blocking)' : ' (advisory)'}`}
                />
              )}
            </div>
            <div className="ad-eval-dim-foot">
              {rule ? (
                <span>min {rule.min} · {rule.rules.length === 1 ? rule.rules[0] : `${rule.rules.length} rules`}</span>
              ) : (
                <span>no dimension rule · threshold ref {threshold}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
