import React from 'react';
import { EVALUATION_MEASURES } from '../../../model/evaluationModel';

/**
 * Horizontal bar per evaluation measure, with a marker at the reference line
 * (the pass mark, or a rule threshold).
 *
 * @param {Object} props
 * @param {Record<string, number | null>} props.scores Score per measure id; null shows "—".
 * @param {number} props.reference                   Where to draw the reference marker (0–100).
 * @param {string} [props.referenceLabel]            Accessible description of the marker.
 * @returns {JSX.Element}
 */
export default function ScoreBars({ scores, reference, referenceLabel = 'Pass mark' }) {
  return (
    <ul className="ams-score-bars">
      {EVALUATION_MEASURES.map(({ id, label, hint }) => {
        const value = scores[id];
        const below = value !== null && value !== undefined && value < reference;
        return (
          <li key={id} className="ams-score-row" title={hint}>
            <span className="ams-score-label">{label}</span>
            <span
              className="ams-score-track"
              role="meter"
              aria-label={`${label}: ${value ?? 'no score'} (${referenceLabel.toLowerCase()} ${reference})`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={value ?? 0}
            >
              <span className={`ams-score-fill ${below ? 'is-below' : ''}`} style={{ width: `${value ?? 0}%` }} />
              <span className="ams-score-marker" style={{ left: `${reference}%` }} aria-hidden="true" />
            </span>
            <span className={`ams-score-value ${below ? 'is-below' : ''}`}>{value ?? '—'}</span>
          </li>
        );
      })}
    </ul>
  );
}
