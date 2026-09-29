import React from 'react';
import { EVAL_DIMENSIONS } from '../../agentStudioData';
import { scoreTone } from './evalUtils';

const W = 430;
const H = 330;
const CX = W / 2;
const CY = H / 2;
const R = 110;
const RINGS = [25, 50, 75, 100];

const angleFor = (i) => (-90 + (360 / EVAL_DIMENSIONS.length) * i) * (Math.PI / 180);
const point = (i, value) => {
  const r = (R * Math.max(0, Math.min(100, value))) / 100;
  const a = angleFor(i);
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
};
const polygon = (values) => values.map((v, i) => point(i, v).map((n) => n.toFixed(1)).join(',')).join(' ');

/**
 * Hand-written SVG radar: 8 evaluation axes, grid rings at 25/50/75/100,
 * translucent agent polygon, dashed threshold polygon and an optional
 * dotted platform-average polygon. Hover a vertex for its value.
 */
export default function RadarChart({ dims, threshold, platformDims = null, agentName = 'Agent' }) {
  const values = EVAL_DIMENSIONS.map((d) => dims[d.key] ?? 0);
  const platform = platformDims ? EVAL_DIMENSIONS.map((d) => platformDims[d.key] ?? 0) : null;

  return (
    <figure className="ad-eval-radar">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${agentName} evaluation radar across ${EVAL_DIMENSIONS.length} dimensions`}>
        {RINGS.map((ring) => (
          <polygon key={ring} className={`ad-eval-radar-ring ${ring === 100 ? 'is-outer' : ''}`} points={polygon(EVAL_DIMENSIONS.map(() => ring))} />
        ))}
        {EVAL_DIMENSIONS.map((d, i) => {
          const [x, y] = point(i, 100);
          return <line key={d.key} className="ad-eval-radar-axis" x1={CX} y1={CY} x2={x} y2={y} />;
        })}
        {RINGS.map((ring) => (
          <text key={`t${ring}`} className="ad-eval-radar-ring-label" x={CX + 3} y={CY - (R * ring) / 100 + 9}>{ring}</text>
        ))}

        {platform && <polygon className="ad-eval-radar-platform" points={polygon(platform)}><title>Platform average</title></polygon>}
        <polygon className="ad-eval-radar-threshold" points={polygon(EVAL_DIMENSIONS.map(() => threshold))}>
          <title>{`Pass threshold ${threshold}`}</title>
        </polygon>
        <polygon className="ad-eval-radar-agent" points={polygon(values)} />

        {EVAL_DIMENSIONS.map((d, i) => {
          const [x, y] = point(i, values[i]);
          return (
            <circle key={d.key} className={`ad-eval-radar-dot is-${scoreTone(values[i], threshold)}`} cx={x} cy={y} r={4.5}>
              <title>{`${d.label}: ${values[i]} (threshold ${threshold})`}</title>
            </circle>
          );
        })}

        {EVAL_DIMENSIONS.map((d, i) => {
          const a = angleFor(i);
          const cos = Math.cos(a);
          const sin = Math.sin(a);
          const x = CX + (R + 14) * cos;
          const y = CY + (R + 14) * sin + (sin > 0.3 ? 8 : sin < -0.3 ? -2 : 4);
          const anchor = cos > 0.3 ? 'start' : cos < -0.3 ? 'end' : 'middle';
          return (
            <text key={d.key} className="ad-eval-radar-label" x={x} y={y} textAnchor={anchor}>
              <title>{`${d.label} — ${d.description}`}</title>
              {d.short}
              <tspan className={`ad-eval-radar-label-val is-${scoreTone(values[i], threshold)}`} dx="4">{values[i]}</tspan>
            </text>
          );
        })}
      </svg>
      <figcaption className="ad-eval-radar-legend">
        <span><i className="ad-eval-lg-agent" /> {agentName}</span>
        <span><i className="ad-eval-lg-threshold" /> Threshold {threshold}</span>
        {platform && <span><i className="ad-eval-lg-platform" /> Platform avg</span>}
      </figcaption>
    </figure>
  );
}
