import React from 'react';

/** Hand-written SVG ring gauge (0–100). Tone derives from the value unless given. */
export default function RingGauge({ value = 0, label, hint, size = 96, stroke = 9, tone }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - v / 100);
  const t = tone || (v >= 85 ? 'good' : v >= 65 ? 'warn' : 'bad');
  const mid = size / 2;

  return (
    <div className={`ad-hrn-gauge is-${t}`}>
      <div className="ad-hrn-gauge-ring" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${label}: ${v}%`}>
          <circle className="ad-hrn-gauge-track" cx={mid} cy={mid} r={r} strokeWidth={stroke} fill="none" />
          <circle
            className="ad-hrn-gauge-bar"
            cx={mid}
            cy={mid}
            r={r}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${mid} ${mid})`}
          />
        </svg>
        <div className="ad-hrn-gauge-center">
          <strong>{v}</strong>
          <small>%</small>
        </div>
      </div>
      <div className="ad-hrn-gauge-label">{label}</div>
      {hint && <div className="ad-hrn-gauge-hint">{hint}</div>}
    </div>
  );
}
