import React, { useId, useState } from 'react';
import { formatUsd } from '../../../model/finopsModel';

const WIDTH = 720;
const HEIGHT = 260;
const MARGIN = { top: 16, right: 132, bottom: 30, left: 56 };
const PLOT_W = WIDTH - MARGIN.left - MARGIN.right;
const PLOT_H = HEIGHT - MARGIN.top - MARGIN.bottom;
const X_TICKS = [1, 5, 10, 15, 20, 25, 30];

/**
 * Rounds a maximum up to a clean axis value (1, 2, 2.5 or 5 × 10ⁿ).
 *
 * @param {number} value
 * @returns {number}
 */
function niceCeil(value) {
  const magnitude = 10 ** Math.floor(Math.log10(Math.max(value, 1)));
  const step = [1, 2, 2.5, 5, 10].find((candidate) => candidate * magnitude >= value);
  return step * magnitude;
}

/**
 * Cumulative month spend against the budget cap (F10): actual spend to date as
 * a solid line, the end-of-month forecast dashed in the same hue, and the cap
 * as a labelled reference line. One series, so no legend box — the title names
 * it. Hover or use ←/→ for the daily readout; the table view lists every day.
 *
 * @param {Object} props
 * @param {Array<{ day: number, spend: number, cumulative: number, forecast: boolean }>} props.days
 * @param {number} props.dayOfMonth
 * @param {number} props.cap
 * @param {string} props.monthLabel
 * @returns {JSX.Element}
 */
export default function SpendBurnChart({ days, dayOfMonth, cap, monthLabel }) {
  const titleId = useId();
  const [activeDay, setActiveDay] = useState(null);
  const last = days[days.length - 1];
  const today = days[dayOfMonth - 1];
  const yMax = niceCeil(Math.max(cap, last.cumulative) * 1.08);

  const x = (day) => MARGIN.left + ((day - 1) / (days.length - 1)) * PLOT_W;
  const y = (value) => MARGIN.top + PLOT_H - (value / yMax) * PLOT_H;
  const path = (points) => points.map((point, index) => `${index ? 'L' : 'M'}${x(point.day).toFixed(1)},${y(point.cumulative).toFixed(1)}`).join(' ');

  const actual = days.slice(0, dayOfMonth);
  const forecast = days.slice(dayOfMonth - 1);
  const area = `${path(actual)} L${x(dayOfMonth).toFixed(1)},${y(0)} L${x(1)},${y(0)} Z`;
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((share) => share * yMax);
  const active = activeDay ? days[activeDay - 1] : null;

  /** Snaps the pointer to the nearest day. */
  const handlePointer = (event) => {
    const box = event.currentTarget.getBoundingClientRect();
    const plotX = ((event.clientX - box.left) / box.width) * WIDTH - MARGIN.left;
    const day = Math.round((plotX / PLOT_W) * (days.length - 1)) + 1;
    setActiveDay(Math.min(Math.max(day, 1), days.length));
  };

  const handleKey = (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const step = event.key === 'ArrowRight' ? 1 : -1;
    setActiveDay((current) => Math.min(Math.max((current ?? dayOfMonth) + step, 1), days.length));
  };

  return (
    <figure className="ams-chart">
      <figcaption id={titleId} className="ams-chart-title">
        Cumulative AI spend, {monthLabel}
        <span className="ams-muted-note"> — actual to day {dayOfMonth}, dashed forecast to month end</span>
      </figcaption>
      <div className="ams-chart-frame">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-labelledby={titleId}
          tabIndex={0}
          onPointerMove={handlePointer}
          onPointerLeave={() => setActiveDay(null)}
          onKeyDown={handleKey}
          onBlur={() => setActiveDay(null)}
        >
          {yTicks.map((tick) => (
            <g key={tick}>
              <line className="ams-chart-grid" x1={MARGIN.left} x2={MARGIN.left + PLOT_W} y1={y(tick)} y2={y(tick)} />
              <text className="ams-chart-axis" x={MARGIN.left - 8} y={y(tick) + 4} textAnchor="end">{formatUsd(tick)}</text>
            </g>
          ))}
          {X_TICKS.filter((tick) => tick <= days.length).map((tick) => (
            <text key={tick} className="ams-chart-axis" x={x(tick)} y={HEIGHT - 8} textAnchor="middle">{tick}</text>
          ))}

          <line className="ams-chart-cap" x1={MARGIN.left} x2={MARGIN.left + PLOT_W} y1={y(cap)} y2={y(cap)} />
          <text className="ams-chart-label" x={MARGIN.left + PLOT_W + 8} y={y(cap) + 4}>Cap {formatUsd(cap)}</text>

          <path className="ams-chart-area" d={area} />
          <path className="ams-chart-line" d={path(actual)} />
          {forecast.length > 1 && <path className="ams-chart-line is-forecast" d={path(forecast)} />}

          <circle className="ams-chart-dot" cx={x(dayOfMonth)} cy={y(today.cumulative)} r={4} />
          <text className="ams-chart-label" x={x(dayOfMonth) + 8} y={y(today.cumulative) - 8}>To date {formatUsd(today.cumulative)}</text>
          {forecast.length > 1 && (
            <text className="ams-chart-label is-muted" x={MARGIN.left + PLOT_W + 8} y={y(last.cumulative) + 4}>Forecast {formatUsd(last.cumulative)}</text>
          )}

          {active && (
            <g pointerEvents="none">
              <line className="ams-chart-crosshair" x1={x(active.day)} x2={x(active.day)} y1={MARGIN.top} y2={MARGIN.top + PLOT_H} />
              <circle className="ams-chart-dot" cx={x(active.day)} cy={y(active.cumulative)} r={4} />
            </g>
          )}
          <rect x={MARGIN.left} y={MARGIN.top} width={PLOT_W} height={PLOT_H} fill="transparent" />
        </svg>

        {active && (
          <div
            className="ams-chart-tooltip"
            role="status"
            style={{ left: `${(x(active.day) / WIDTH) * 100}%`, top: `${(y(active.cumulative) / HEIGHT) * 100}%` }}
          >
            <strong>{formatUsd(active.cumulative)}</strong>
            <span><span className={`ams-chart-key ${active.forecast ? 'is-forecast' : ''}`} aria-hidden="true" /> {active.forecast ? 'Forecast' : 'Spent'} by day {active.day}</span>
            <span className="ams-muted-note">That day: {formatUsd(active.spend)}</span>
          </div>
        )}
      </div>

      <details className="ams-details-disclosure">
        <summary>Show as table</summary>
        <div className="ams-table-wrap">
          <table className="ams-table">
            <thead>
              <tr><th scope="col">Day</th><th scope="col">Daily spend</th><th scope="col">Cumulative</th><th scope="col">Type</th></tr>
            </thead>
            <tbody>
              {days.map((entry) => (
                <tr key={entry.day}>
                  <td>{entry.day}</td>
                  <td>{formatUsd(entry.spend)}</td>
                  <td className="is-strong">{formatUsd(entry.cumulative)}</td>
                  <td className="is-small">{entry.forecast ? 'Forecast' : 'Actual'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
