import React from 'react';

const RADIUS = 34;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Colour band for a percentage.
 *
 * @param {number} value
 * @returns {string} Modifier class.
 */
function tone(value) {
  if (value >= 80) return 'is-good';
  if (value >= 60) return 'is-warn';
  return 'is-bad';
}

/**
 * Circular percentage gauge.
 *
 * @param {Object} props
 * @param {number | null} props.value 0–100; null renders an empty ring with "—".
 * @param {string} props.label
 * @returns {JSX.Element}
 */
export default function RingGauge({ value, label }) {
  const shown = value ?? 0;
  return (
    <figure className={`ams-ring ${value === null ? 'is-empty' : tone(shown)}`}>
      <svg viewBox="0 0 80 80" role="img" aria-label={`${label}: ${value === null ? 'no data' : `${shown}%`}`}>
        <circle className="ams-ring-track" cx="40" cy="40" r={RADIUS} />
        <circle
          className="ams-ring-value"
          cx="40"
          cy="40"
          r={RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - shown / 100)}
        />
        <text x="40" y="45" textAnchor="middle" className="ams-ring-text">{value === null ? '—' : `${shown}%`}</text>
      </svg>
      <figcaption>{label}</figcaption>
    </figure>
  );
}
