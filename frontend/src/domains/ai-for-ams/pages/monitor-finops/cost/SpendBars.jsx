import React from 'react';
import { formatUsd } from '../../../model/finopsModel';

/**
 * Horizontal bars for one magnitude breakdown (spend by area, spend by model):
 * one hue, sorted, value at the bar tip, share in the hover title.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {Array<{ id: string, label: string, spend: number }>} props.rows Sorted, largest first.
 * @returns {JSX.Element}
 */
export default function SpendBars({ title, rows }) {
  const max = Math.max(...rows.map((row) => row.spend), 1);
  const total = rows.reduce((sum, row) => sum + row.spend, 0);

  return (
    <figure className="ams-chart">
      <figcaption className="ams-chart-title">{title}</figcaption>
      <ul className="ams-hbars">
        {rows.map((row) => {
          const share = total ? Math.round((row.spend / total) * 100) : 0;
          return (
            <li key={row.id} className="ams-hbar" title={`${row.label}: ${formatUsd(row.spend)} (${share}% of spend)`} tabIndex={0}>
              <span className="ams-hbar-label">{row.label}</span>
              <span className="ams-hbar-track">
                <span className="ams-hbar-fill" style={{ width: `${Math.max((row.spend / max) * 100, 1)}%` }} />
              </span>
              <span className="ams-hbar-value">{formatUsd(row.spend)} <span className="ams-muted-note">{share}%</span></span>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
