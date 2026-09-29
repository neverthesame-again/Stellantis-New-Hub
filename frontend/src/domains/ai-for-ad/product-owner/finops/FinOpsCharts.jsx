import React, { useLayoutEffect, useRef, useState } from 'react';
import { CYCLE, isWeekend, fmtMoney, fmtTokens } from './adFinOpsData';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const dayLabel = (d) => `${CYCLE.month} ${d} · ${WEEKDAYS[(d + 1) % 7]}`;

/** Tracks the rendered width of a container so SVG text stays crisp (no viewBox stretching). */
function useWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    setWidth(el.clientWidth);
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width];
}

function niceMax(max, ticks = 4) {
  if (max <= 0) return { top: 1, step: 0.25 };
  const raw = max / ticks;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw);
  return { top: Math.ceil(max / step) * step, step };
}

/** Bar with rounded data-end (top) and a square baseline. */
function barPath(x, y, w, h, r = 4) {
  if (h <= 0) return '';
  const rr = Math.min(r, w / 2, h);
  return `M${x},${y + h}V${y + rr}Q${x},${y} ${x + rr},${y}H${x + w - rr}Q${x + w},${y} ${x + w},${y + rr}V${y + h}Z`;
}

function Tooltip({ x, width, children }) {
  const flip = x > width - 190;
  return (
    <div className="ad-fo-tip" style={{ left: flip ? undefined : x + 14, right: flip ? width - x + 14 : undefined }}>
      {children}
    </div>
  );
}

function TipRow({ swatch, label, value, dashed }) {
  return (
    <div className="ad-fo-tip-row">
      <span className={`ad-fo-swatch ${dashed ? 'is-dashed' : ''}`} style={{ '--sw': swatch }} />
      <span className="ad-fo-tip-label">{label}</span>
      <span className="ad-fo-tip-value">{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Daily / cumulative burn chart                                       */
/* ------------------------------------------------------------------ */
export function BurnChart({ daily, prevDaily, budget, mode = 'cumulative', height = 260 }) {
  const [ref, width] = useWidth();
  const [hover, setHover] = useState(null);
  const { days, today } = CYCLE;
  const m = { l: 56, r: 18, t: 18, b: 30 };
  const iw = Math.max(0, width - m.l - m.r);
  const ih = height - m.t - m.b;
  const band = iw / days;
  const xc = (d) => m.l + band * (d - 0.5);

  const cum = [];
  const prevCum = [];
  daily.reduce((acc, v, i) => (cum[i] = acc + v), 0);
  prevDaily.reduce((acc, v, i) => (prevCum[i] = acc + v), 0);

  const allowance = budget / days;
  const maxVal = mode === 'daily'
    ? Math.max(...daily, ...prevDaily, allowance) * 1.08
    : Math.max(cum[days - 1], prevCum[days - 1], budget) * 1.06;
  const { top, step } = niceMax(maxVal);
  const y = (v) => m.t + ih - (v / top) * ih;
  const ticks = [];
  for (let v = 0; v <= top + 1e-9; v += step) ticks.push(v);

  const line = (arr, from, to) => arr.slice(from - 1, to).map((v, i) => `${i ? 'L' : 'M'}${xc(from + i).toFixed(1)},${y(v).toFixed(1)}`).join('');

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const d = Math.floor((e.clientX - rect.left - m.l) / band) + 1;
    setHover(d >= 1 && d <= days ? d : null);
  };

  const h = hover;
  const isForecast = h && h > today;
  const overBudget = cum[days - 1] > budget;

  return (
    <div className="ad-fo-chart" ref={ref} style={{ height }}>
      {width > 0 && (
        <svg width={width} height={height} onMouseMove={onMove} onMouseLeave={() => setHover(null)} role="img"
          aria-label={mode === 'daily' ? 'Daily spend, actual and forecast' : 'Cumulative spend versus budget'}>
          <defs>
            <linearGradient id="fo-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--fo-s1)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--fo-s1)" stopOpacity="0" />
            </linearGradient>
            <pattern id="fo-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="6" height="6" fill="var(--fo-s1)" fillOpacity="0.14" />
              <line x1="0" y1="0" x2="0" y2="6" stroke="var(--fo-s1)" strokeWidth="2" strokeOpacity="0.45" />
            </pattern>
          </defs>

          {/* grid + y axis */}
          {ticks.map((t) => (
            <g key={t}>
              <line x1={m.l} x2={m.l + iw} y1={y(t)} y2={y(t)} className="ad-fo-grid" />
              <text x={m.l - 10} y={y(t)} className="ad-fo-axis" textAnchor="end" dominantBaseline="middle">
                {fmtMoney(t, { compact: true, decimals: 0 })}
              </text>
            </g>
          ))}
          {/* weekends shading (daily only) */}
          {mode === 'daily' && Array.from({ length: days }, (_, i) => i + 1).filter(isWeekend).map((d) => (
            <rect key={d} x={m.l + band * (d - 1)} y={m.t} width={band} height={ih} className="ad-fo-weekend" />
          ))}
          {/* forecast region */}
          <rect x={m.l + band * today} y={m.t} width={band * (days - today)} height={ih} className="ad-fo-forecast-zone" />
          <line x1={m.l + band * today} x2={m.l + band * today} y1={m.t - 6} y2={m.t + ih} className="ad-fo-today" />
          <text x={m.l + band * today + 6} y={m.t + 4} className="ad-fo-axis ad-fo-axis-strong" dominantBaseline="hanging">Forecast →</text>

          {mode === 'daily' ? (
            <>
              {daily.map((v, i) => {
                const d = i + 1;
                const bw = Math.max(2, band - 4);
                return (
                  <path key={d} d={barPath(m.l + band * i + 2, y(v), bw, y(0) - y(v), Math.min(4, bw / 2))}
                    fill={d > today ? 'url(#fo-hatch)' : 'var(--fo-s1)'}
                    opacity={h && h !== d ? 0.55 : 1} />
                );
              })}
              <path d={line(prevDaily, 1, days)} className="ad-fo-line-prev" />
              <line x1={m.l} x2={m.l + iw} y1={y(allowance)} y2={y(allowance)} className="ad-fo-line-budget" />
              <text x={m.l + iw} y={y(allowance) - 6} textAnchor="end" className="ad-fo-axis ad-fo-axis-strong">
                Daily allowance {fmtMoney(allowance, { decimals: 0 })}
              </text>
            </>
          ) : (
            <>
              <path d={`${line(cum, 1, today)}L${xc(today)},${y(0)}L${xc(1)},${y(0)}Z`} fill="url(#fo-area)" />
              <path d={line(prevCum, 1, days)} className="ad-fo-line-prev" />
              <path d={line(cum, 1, today)} className="ad-fo-line-actual" />
              <path d={line(cum, today, days)} className="ad-fo-line-forecast" />
              <line x1={m.l} x2={m.l + iw} y1={y(budget)} y2={y(budget)} className={`ad-fo-line-budget ${overBudget ? 'is-breach' : ''}`} />
              <text x={m.l + 4} y={y(budget) - 6} className="ad-fo-axis ad-fo-axis-strong">
                Budget {fmtMoney(budget, { compact: true })}
              </text>
              <circle cx={xc(days)} cy={y(cum[days - 1])} r="4.5" className="ad-fo-dot-forecast" />
              <text x={xc(days) - 8} y={y(cum[days - 1]) + (overBudget ? -10 : 16)} textAnchor="end" className="ad-fo-axis ad-fo-axis-strong">
                EOM {fmtMoney(cum[days - 1], { compact: true })}
              </text>
              <circle cx={xc(today)} cy={y(cum[today - 1])} r="4.5" className="ad-fo-dot-actual" />
            </>
          )}

          {/* x axis */}
          <line x1={m.l} x2={m.l + iw} y1={y(0)} y2={y(0)} className="ad-fo-baseline" />
          {Array.from({ length: days }, (_, i) => i + 1)
            .filter((d) => d === 1 || d % (iw < 420 ? 7 : 3) === 1 || d === days)
            .map((d) => (
              <text key={d} x={xc(d)} y={height - 10} textAnchor="middle" className="ad-fo-axis">{d}</text>
            ))}

          {/* hover crosshair */}
          {h && (
            <g pointerEvents="none">
              <line x1={xc(h)} x2={xc(h)} y1={m.t} y2={m.t + ih} className="ad-fo-crosshair" />
              {mode === 'cumulative' && (
                <>
                  <circle cx={xc(h)} cy={y(prevCum[h - 1])} r="4" className="ad-fo-dot-prev" />
                  <circle cx={xc(h)} cy={y(cum[h - 1])} r="5" className={isForecast ? 'ad-fo-dot-forecast' : 'ad-fo-dot-actual'} />
                </>
              )}
            </g>
          )}
        </svg>
      )}
      {h && (
        <Tooltip x={xc(h)} width={width}>
          <div className="ad-fo-tip-title">{dayLabel(h)}{isForecast && <span className="ad-fo-tip-tag">Forecast</span>}</div>
          <TipRow swatch="var(--fo-s1)" dashed={isForecast} label={isForecast ? 'Projected spend' : 'Spend'} value={fmtMoney(daily[h - 1])} />
          <TipRow swatch="var(--fo-prev)" label="Last cycle" value={fmtMoney(prevDaily[h - 1])} />
          <div className="ad-fo-tip-sep" />
          <TipRow swatch="transparent" label="Cumulative" value={fmtMoney(cum[h - 1], { decimals: 0 })} />
          <TipRow swatch="transparent" label="of budget" value={`${Math.round((cum[h - 1] / budget) * 100)}%`} />
        </Tooltip>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stacked daily token chart                                           */
/* ------------------------------------------------------------------ */
const TOKEN_SERIES = [
  { key: 'input', label: 'Input', color: 'var(--fo-s1)' },
  { key: 'output', label: 'Output', color: 'var(--fo-s2)' },
  { key: 'cached', label: 'Cache read', color: 'var(--fo-s3)' }
];

export function TokenStackChart({ data, height = 240 }) {
  const [ref, width] = useWidth();
  const [hover, setHover] = useState(null);
  const m = { l: 52, r: 12, t: 12, b: 30 };
  const iw = Math.max(0, width - m.l - m.r);
  const ih = height - m.t - m.b;
  const n = data.length;
  const band = iw / n;
  const totals = data.map((d) => d.input + d.output + d.cached);
  const { top, step } = niceMax(Math.max(...totals, 1) * 1.05);
  const y = (v) => m.t + ih - (v / top) * ih;
  const ticks = [];
  for (let v = 0; v <= top + 1e-9; v += step) ticks.push(v);

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const i = Math.floor((e.clientX - rect.left - m.l) / band);
    setHover(i >= 0 && i < n ? i : null);
  };
  const hd = hover != null ? data[hover] : null;

  return (
    <div className="ad-fo-chart" ref={ref} style={{ height }}>
      {width > 0 && (
        <svg width={width} height={height} onMouseMove={onMove} onMouseLeave={() => setHover(null)} role="img" aria-label="Daily LLM tokens by type">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={m.l} x2={m.l + iw} y1={y(t)} y2={y(t)} className="ad-fo-grid" />
              <text x={m.l - 10} y={y(t)} className="ad-fo-axis" textAnchor="end" dominantBaseline="middle">{fmtTokens(t)}</text>
            </g>
          ))}
          {data.map((d, i) => {
            const bw = Math.max(2, band - 5);
            const x = m.l + band * i + 2.5;
            let base = 0;
            return (
              <g key={d.day} opacity={hover != null && hover !== i ? 0.5 : 1}>
                {TOKEN_SERIES.map((s, si) => {
                  const v = d[s.key];
                  const y0 = y(base);
                  const y1 = y(base + v);
                  base += v;
                  const isTop = si === TOKEN_SERIES.length - 1;
                  const hgt = Math.max(0, y0 - y1 - (si > 0 ? 2 : 0)); // 2px surface gap between stacked fills
                  return isTop
                    ? <path key={s.key} d={barPath(x, y1, bw, hgt, Math.min(4, bw / 2))} fill={s.color} />
                    : <rect key={s.key} x={x} y={y1} width={bw} height={hgt} fill={s.color} />;
                })}
              </g>
            );
          })}
          <line x1={m.l} x2={m.l + iw} y1={y(0)} y2={y(0)} className="ad-fo-baseline" />
          {data.filter((d) => d.day === 1 || d.day % 3 === 1 || d.day === n).map((d) => (
            <text key={d.day} x={m.l + band * (d.day - 0.5)} y={height - 10} textAnchor="middle" className="ad-fo-axis">{d.day}</text>
          ))}
        </svg>
      )}
      {hd && (
        <Tooltip x={m.l + band * (hover + 0.5)} width={width}>
          <div className="ad-fo-tip-title">{dayLabel(hd.day)}</div>
          {[...TOKEN_SERIES].reverse().map((s) => <TipRow key={s.key} swatch={s.color} label={s.label} value={fmtTokens(hd[s.key])} />)}
          <div className="ad-fo-tip-sep" />
          <TipRow swatch="transparent" label="Total" value={fmtTokens(hd.input + hd.output + hd.cached)} />
        </Tooltip>
      )}
    </div>
  );
}
TokenStackChart.series = TOKEN_SERIES;

/* ------------------------------------------------------------------ */
/* Small marks                                                         */
/* ------------------------------------------------------------------ */
export function Sparkline({ values, width = 96, height = 28, tone = 'accent' }) {
  if (!values?.length) return null;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => [(i / (values.length - 1)) * (width - 6) + 3, height - 4 - ((v - min) / span) * (height - 8)]);
  const d = pts.map(([x, yy], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${yy.toFixed(1)}`).join('');
  const [lx, ly] = pts[pts.length - 1];
  return (
    <svg className={`ad-fo-spark is-${tone}`} width={width} height={height} aria-hidden="true">
      <path d={`${d}L${lx},${height}L3,${height}Z`} className="ad-fo-spark-area" />
      <path d={d} className="ad-fo-spark-line" />
      <circle cx={lx} cy={ly} r="2.75" className="ad-fo-spark-dot" />
    </svg>
  );
}

/** Budget ring with a tick marking the expected pace for today. */
export function BudgetRing({ used, pace, size = 132, stroke = 12, tone }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const mid = size / 2;
  const v = Math.max(0, Math.min(1, used));
  const a = pace * 2 * Math.PI - Math.PI / 2;
  const tick = (rad) => [mid + Math.cos(a) * rad, mid + Math.sin(a) * rad];
  const [x1, y1] = tick(r - stroke / 2 - 4);
  const [x2, y2] = tick(r + stroke / 2 + 4);
  return (
    <div className={`ad-fo-ring is-${tone}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} role="img" aria-label={`${Math.round(used * 100)}% of budget used, pace ${Math.round(pace * 100)}%`}>
        <circle cx={mid} cy={mid} r={r} strokeWidth={stroke} className="ad-fo-ring-track" fill="none" />
        <circle cx={mid} cy={mid} r={r} strokeWidth={stroke} className="ad-fo-ring-bar" fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - v)} transform={`rotate(-90 ${mid} ${mid})`} />
        <line x1={x1} y1={y1} x2={x2} y2={y2} className="ad-fo-ring-pace" />
      </svg>
      <div className="ad-fo-ring-center">
        <strong>{Math.round(used * 100)}<small>%</small></strong>
        <span>used</span>
      </div>
    </div>
  );
}

/** Part-to-whole bar: segments separated by a 2px surface gap, hoverable. */
export function ShareBar({ items, height = 12 }) {
  const [hover, setHover] = useState(null);
  const total = items.reduce((a, b) => a + b.value, 0) || 1;
  return (
    <div className="ad-fo-sharebar" style={{ height }} onMouseLeave={() => setHover(null)}>
      {items.filter((it) => it.value > 0).map((it) => (
        <div key={it.key} className="ad-fo-sharebar-seg" onMouseEnter={() => setHover(it.key)}
          style={{ flexGrow: it.value / total, background: it.color, opacity: hover && hover !== it.key ? 0.45 : 1 }}
          title={`${it.label}: ${fmtMoney(it.value, { decimals: 0 })} (${Math.round((it.value / total) * 100)}%)`} />
      ))}
    </div>
  );
}
