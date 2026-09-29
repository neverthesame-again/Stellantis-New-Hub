import React from 'react';
import { coverageTone } from './governanceUtils';

/**
 * CoverageRing — small hand-drawn SVG donut for a coverage percentage.
 * `label` replaces the centre text (defaults to "NN%").
 */
export default function CoverageRing({ pct, size = 56, stroke = 6, label, sublabel }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const value = pct == null ? 0 : Math.max(0, Math.min(100, pct));
  const centre = size / 2;
  return (
    <svg
      className={`ad-gov-ring ${coverageTone(pct)}`}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={pct == null ? 'No coverage data' : `${value}% coverage`}
    >
      <circle className="ad-gov-ring-track" cx={centre} cy={centre} r={r} strokeWidth={stroke} fill="none" />
      <circle
        className="ad-gov-ring-value"
        cx={centre}
        cy={centre}
        r={r}
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${(c * value) / 100} ${c}`}
        transform={`rotate(-90 ${centre} ${centre})`}
      />
      <text className="ad-gov-ring-text" x="50%" y={sublabel ? '46%' : '50%'} textAnchor="middle" dominantBaseline="central">
        {label ?? (pct == null ? '—' : `${value}%`)}
      </text>
      {sublabel && (
        <text className="ad-gov-ring-sub" x="50%" y="68%" textAnchor="middle" dominantBaseline="central">{sublabel}</text>
      )}
    </svg>
  );
}
