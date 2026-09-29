import React, { useMemo, useState } from 'react';
import {
  Wallet, TrendingUp, TrendingDown, Gauge, Coins, Database, Zap, AlertTriangle, AlertOctagon, Info,
  ShieldCheck, Sparkles, ArrowRight, Download, RefreshCw, CalendarDays, LayoutDashboard, BellRing,
  ListOrdered, BarChart3, Lightbulb, SlidersHorizontal, Check, Undo2, ExternalLink, BellOff, Cpu
} from 'lucide-react';
import {
  buildFinOps, CYCLE, GUARDRAILS, BILLING_LABEL, LEVEL_ORDER, fmtMoney, fmtTokens, fmtPct
} from './adFinOpsData';
import { BurnChart, TokenStackChart, Sparkline, BudgetRing, ShareBar } from './FinOpsCharts';
import './adSubscriptionFinOps.css';

const MODEL_COLORS = { sonnet: 'var(--fo-s1)', haiku: 'var(--fo-s2)', vit: 'var(--fo-s3)', radar: 'var(--fo-s4)' };
const LEVEL_COLORS = LEVEL_ORDER.reduce((acc, l, i) => ({ ...acc, [l]: `var(--fo-l${i + 1})` }), {});
const SEVERITY = {
  critical: { label: 'Critical', icon: AlertOctagon },
  warning: { label: 'Warning', icon: AlertTriangle },
  info: { label: 'Info', icon: Info }
};

/** Budget tone from a 0–1+ ratio of forecast to budget. */
const toneFor = (ratio) => (ratio > 1 ? 'bad' : ratio >= 0.95 ? 'warn' : 'good');

function Delta({ value, invert = true, suffix = 'vs last cycle' }) {
  // For spend, up is bad (invert=true)
  const up = value > 0;
  const tone = Math.abs(value) < 0.005 ? 'neutral' : (up === invert ? 'bad' : 'good');
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span className={`ad-fo-delta is-${tone}`}>
      <Icon size={13} />
      <span>{up ? '+' : '−'}{Math.abs(value * 100).toFixed(1)}%</span>
      <span className="ad-fo-delta-suffix">{suffix}</span>
    </span>
  );
}

function Kpi({ label, icon: Icon, value, unit, children, spark, sparkTone }) {
  return (
    <div className="ad-fo-kpi">
      <div className="ad-fo-kpi-head">
        <span className="ad-fo-eyebrow">{label}</span>
        <span className="ad-fo-kpi-icon"><Icon size={15} /></span>
      </div>
      <div className="ad-fo-kpi-row">
        <div className="ad-fo-kpi-value">
          <strong>{value}</strong>
          {unit && <span>{unit}</span>}
        </div>
        {spark && <Sparkline values={spark} tone={sparkTone} width={84} height={30} />}
      </div>
      <div className="ad-fo-kpi-foot">{children}</div>
    </div>
  );
}

function Card({ eyebrow, title, action, children, className = '' }) {
  return (
    <section className={`ad-fo-card ${className}`}>
      {(eyebrow || title || action) && (
        <header className="ad-fo-card-head">
          <div>
            {eyebrow && <div className="ad-fo-eyebrow is-accent">{eyebrow}</div>}
            {title && <h3>{title}</h3>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

function Segmented({ value, onChange, options, size = 'md' }) {
  return (
    <div className={`ad-fo-seg is-${size}`} role="tablist">
      {options.map((o) => (
        <button key={o.id} role="tab" aria-selected={value === o.id} className={value === o.id ? 'active' : ''} onClick={() => onChange(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Legend({ items }) {
  return (
    <div className="ad-fo-legend">
      {items.map((it) => (
        <span key={it.label}><i className={`ad-fo-swatch ${it.kind ? `is-${it.kind}` : ''}`} style={{ '--sw': it.color }} />{it.label}</span>
      ))}
    </div>
  );
}

function UtilBar({ util, pace, tone }) {
  return (
    <div className="ad-fo-util" title={`${Math.round(util * 100)}% used · pace ${Math.round(pace * 100)}%`}>
      <div className={`ad-fo-util-fill is-${tone}`} style={{ width: `${Math.min(100, util * 100)}%` }} />
      <div className="ad-fo-util-pace" style={{ left: `${pace * 100}%` }} />
    </div>
  );
}

/* ================================================================== */

export default function AdSubscriptionFinOps({ subscriptions, onInspect, onNotify }) {
  const [tab, setTab] = useState('overview');
  const [applied, setApplied] = useState(() => new Set());
  const [snoozed, setSnoozed] = useState(() => new Set());
  const [burnMode, setBurnMode] = useState('cumulative');
  const [alertFilter, setAlertFilter] = useState('all');
  const [costFilter, setCostFilter] = useState('all');
  const [sortKey, setSortKey] = useState('forecast');
  const [guardrails, setGuardrails] = useState(GUARDRAILS);

  const fo = useMemo(() => buildFinOps(subscriptions, applied), [subscriptions, applied]);
  const { days, today } = CYCLE;
  const notify = (msg, undo) => onNotify && onNotify(msg, undo);

  const liveAlerts = fo.alerts.filter((a) => !snoozed.has(a.id));
  const atRiskCount = new Set(liveAlerts.map((a) => a.subId)).size;
  const recForSub = (subId) => fo.recommendations.find((r) => r.subId === subId && !r.applied);
  const openRecs = fo.recommendations.filter((r) => !r.applied);
  const activeRules = guardrails.filter((g) => g.enabled).length;

  const applyRec = (rec) => {
    setApplied((prev) => new Set(prev).add(rec.id));
    notify(`Applied “${rec.title}”. Saves ~${fmtMoney(rec.monthly, { decimals: 0 })}/month.`, () => {
      setApplied((prev) => { const n = new Set(prev); n.delete(rec.id); return n; });
    });
  };
  const undoRec = (rec) => setApplied((prev) => { const n = new Set(prev); n.delete(rec.id); return n; });
  const inspect = (subId) => {
    const sub = subscriptions.find((s) => s.id === subId);
    if (sub && onInspect) onInspect(sub);
  };

  const exportCsv = () => {
    const head = ['Subscription', 'Category', 'Funded by', 'Billing', 'MTD (EUR)', 'Budget (EUR)', 'Forecast EOM (EUR)', 'Budget used %', 'vs last cycle %'];
    const lines = fo.costed.map((r) => [
      r.name, r.category, r.level, BILLING_LABEL[r.profile.billing], r.mtd.toFixed(2), r.budget.toFixed(2),
      r.forecast.toFixed(2), (r.util * 100).toFixed(1), (r.trend * 100).toFixed(1)
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','));
    const blob = new Blob([[head.join(','), ...lines].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-subscriptions-finops-sep-2026.csv';
    a.click();
    URL.revokeObjectURL(url);
    notify(`Exported ${fo.costed.length} subscription cost lines to CSV.`);
  };

  const TABS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'alerts', label: 'Cost Alerts', icon: BellRing, badge: liveAlerts.length, tone: liveAlerts.some((a) => a.severity === 'critical') ? 'bad' : 'warn' },
    { id: 'costs', label: 'Subscription Costs', icon: ListOrdered, badge: fo.costed.length },
    { id: 'tokens', label: 'Token Analytics', icon: BarChart3 },
    { id: 'optimize', label: 'Optimization', icon: Lightbulb, badge: openRecs.length, tone: 'good' },
    { id: 'guardrails', label: 'Budget Guardrails', icon: SlidersHorizontal, badge: activeRules }
  ];

  const forecastTone = toneFor(fo.forecast / fo.budget);
  const usedRatio = fo.mtd / fo.budget;
  const paceGap = usedRatio - fo.pace;

  return (
    <div className="ad-fo">
      {/* Cycle strip + tabs */}
      <div className="ad-fo-topbar">
        <div className="ad-fo-cycle">
          <span className="ad-fo-cycle-chip"><CalendarDays size={13} /> Billing cycle {CYCLE.label}</span>
          <span className="ad-fo-cycle-day">
            Day <strong>{today}</strong>/{days}
            <span className="ad-fo-cycle-track"><span style={{ width: `${fo.pace * 100}%` }} /></span>
          </span>
          <span className="ad-fo-cycle-sync"><RefreshCw size={12} /> Synced 4 min ago · EUR</span>
        </div>
        <button className="ad-fo-btn is-ghost" onClick={exportCsv}><Download size={13} /> Export CSV</button>
      </div>

      <nav className="ad-fo-tabs" aria-label="FinOps sections">
        {TABS.map((t) => (
          <button key={t.id} className={`ad-fo-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            <t.icon size={14} />
            <span>{t.label}</span>
            {t.badge != null && t.badge > 0 && <span className={`ad-fo-tab-badge ${t.tone ? `is-${t.tone}` : ''}`}>{t.badge}</span>}
          </button>
        ))}
      </nav>

      {fo.costed.length === 0 && (
        <div className="ad-fo-empty">
          <Wallet size={28} />
          <h4>No billable subscriptions</h4>
          <p>Everything left in your list is a policy or cost center with no direct charge.</p>
        </div>
      )}

      {/* ============================ OVERVIEW ============================ */}
      {fo.costed.length > 0 && tab === 'overview' && (
        <>
          <div className="ad-fo-kpis">
            <Kpi label="MTD spend" icon={Wallet} value={fmtMoney(fo.mtd, { decimals: 0 })} spark={fo.daily.slice(today - 14, today)}>
              <Delta value={(fo.mtd - fo.prevMtd) / fo.prevMtd} />
            </Kpi>
            <Kpi label="Forecast end of cycle" icon={TrendingUp} value={fmtMoney(fo.forecast, { decimals: 0 })} unit={`/ ${fmtMoney(fo.budget, { compact: true })}`}>
              <span className={`ad-fo-status is-${forecastTone}`}>
                {forecastTone === 'bad' ? <AlertOctagon size={13} /> : forecastTone === 'warn' ? <AlertTriangle size={13} /> : <Check size={13} />}
                {fo.forecast > fo.budget ? `${fmtMoney(fo.forecast - fo.budget, { decimals: 0 })} over budget` : `${fmtMoney(fo.budget - fo.forecast, { decimals: 0 })} headroom`}
              </span>
            </Kpi>
            <Kpi label="Budget used" icon={Gauge} value={fmtPct(usedRatio)} unit={`of ${fmtMoney(fo.budget, { compact: true })}`}>
              <span className={`ad-fo-status is-${paceGap > 0.03 ? 'warn' : 'good'}`}>
                {paceGap > 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                {Math.abs(Math.round(paceGap * 100))} pts {paceGap > 0 ? 'ahead of' : 'behind'} {Math.round(fo.pace * 100)}% pace
              </span>
            </Kpi>
            <Kpi label="LLM token volume" icon={Coins} value={fmtTokens(fo.tokensM)} unit="tokens" spark={fo.tokenDaily.slice(-14).map((d) => d.input + d.output + d.cached)}>
              <span className="ad-fo-muted">{fo.invocations.toLocaleString('en-US')} invocations MTD</span>
            </Kpi>
            <Kpi label="Blended cost / 1M tokens" icon={Database} value={fmtMoney(fo.costPer1M)}>
              <span className="ad-fo-status is-good"><Check size={13} /> Cache saved {fmtMoney(fo.cacheSavings, { decimals: 0 })} MTD</span>
            </Kpi>
            <Kpi label="Efficiency score" icon={Zap} value={fo.efficiency} unit="/100">
              <span className="ad-fo-muted">{fmtMoney(fo.openSavings, { decimals: 0 })}/mo still recoverable</span>
            </Kpi>
          </div>

          {liveAlerts.length > 0 && (
            <div className={`ad-fo-banner is-${liveAlerts[0].severity === 'critical' ? 'bad' : 'warn'}`}>
              <div className="ad-fo-banner-icon"><ShieldCheck size={18} /></div>
              <div className="ad-fo-banner-text">
                <strong>{atRiskCount} subscription{atRiskCount > 1 ? 's' : ''} need{atRiskCount > 1 ? '' : 's'} attention before cycle close</strong>
                <span>{fmtMoney(fo.openSavings, { decimals: 0 })}/month recoverable across {openRecs.length} recommendations · biggest risk: {liveAlerts[0].title}</span>
              </div>
              <div className="ad-fo-banner-actions">
                <button className="ad-fo-btn is-ghost" onClick={() => setTab('optimize')}><Sparkles size={13} /> See savings</button>
                <button className="ad-fo-btn is-primary" onClick={() => setTab('alerts')}>Review alerts <ArrowRight size={13} /></button>
              </div>
            </div>
          )}

          <div className="ad-fo-grid-main">
            <Card eyebrow="Burn rate" title={burnMode === 'cumulative' ? 'Cumulative spend vs budget' : 'Daily spend'}
              action={<Segmented size="sm" value={burnMode} onChange={setBurnMode} options={[{ id: 'cumulative', label: 'Cumulative' }, { id: 'daily', label: 'Daily' }]} />}>
              <Legend items={[
                { label: 'Actual', color: 'var(--fo-s1)' },
                { label: 'Forecast', color: 'var(--fo-s1)', kind: burnMode === 'daily' ? 'hatch' : 'dashed' },
                { label: 'Last cycle', color: 'var(--fo-prev)', kind: 'line' },
                { label: burnMode === 'daily' ? 'Daily allowance' : 'Budget', color: 'var(--fo-budget)', kind: 'dashed' }
              ]} />
              <BurnChart daily={fo.daily} prevDaily={fo.prevDaily} budget={fo.budget} mode={burnMode} />
            </Card>

            <Card eyebrow="Budget" title={`${CYCLE.month} 2026 · My subscriptions`}>
              <div className="ad-fo-budget">
                <BudgetRing used={usedRatio} pace={fo.pace} tone={forecastTone} />
                <div className="ad-fo-budget-legend">
                  <div><span>Consumed</span><strong>{fmtMoney(fo.mtd, { decimals: 0 })}</strong></div>
                  <div><span>Remaining</span><strong>{fmtMoney(fo.budget - fo.mtd, { decimals: 0 })}</strong></div>
                  <div className="ad-fo-muted"><i className="ad-fo-pace-key" /> Tick = expected pace today</div>
                </div>
              </div>
              <dl className="ad-fo-stats">
                <div><dt>Budget</dt><dd>{fmtMoney(fo.budget, { decimals: 0 })}</dd></div>
                <div><dt>Current run-rate (7d)</dt><dd>{fmtMoney(fo.costed.reduce((a, r) => a + r.runRate7, 0), { decimals: 0 })}/day</dd></div>
                <div><dt>Allowance left</dt><dd>{fmtMoney((fo.budget - fo.mtd) / (days - today), { decimals: 0 })}/day</dd></div>
                <div><dt>Projected end of cycle</dt><dd className={`is-${forecastTone}`}>{fmtMoney(fo.forecast, { decimals: 0 })}</dd></div>
                {fo.appliedSavings > 0 && <div><dt>Savings applied</dt><dd className="is-good">−{fmtMoney(fo.appliedSavings, { decimals: 0 })}/mo</dd></div>}
              </dl>
            </Card>
          </div>

          <div className="ad-fo-grid-3">
            <Card eyebrow="Spend by category" title="Where it goes">
              <div className="ad-fo-hbars">
                {Object.entries(fo.byCategory).sort((a, b) => b[1] - a[1]).map(([cat, v]) => (
                  <div key={cat} className="ad-fo-hbar">
                    <span className="ad-fo-hbar-label">{cat}</span>
                    <span className="ad-fo-hbar-track"><span style={{ width: `${(v / Math.max(...Object.values(fo.byCategory))) * 100}%` }} /></span>
                    <span className="ad-fo-hbar-value">{fmtMoney(v, { compact: true })}<small>{Math.round((v / fo.mtd) * 100)}%</small></span>
                  </div>
                ))}
              </div>
            </Card>

            <Card eyebrow="Model cost mix" title="What it runs on">
              <ShareBar items={fo.models.map((m) => ({ key: m.id, label: m.name, value: m.cost, color: MODEL_COLORS[m.id] }))} />
              <div className="ad-fo-mix">
                {fo.models.map((m) => (
                  <div key={m.id} className="ad-fo-mix-row">
                    <i className="ad-fo-swatch" style={{ '--sw': MODEL_COLORS[m.id] }} />
                    <div className="ad-fo-mix-name">
                      <strong>{m.name}</strong>
                      <span>{m.host}</span>
                    </div>
                    <div className="ad-fo-mix-val">
                      <strong>{fmtMoney(m.cost, { decimals: 0 })}</strong>
                      <span>{m.tokensM ? `${fmtTokens(m.tokensM)} tokens` : `${Math.round(m.gpuHours).toLocaleString('en-US')} GPU-h`}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card eyebrow="Chargeback" title="Who funds it">
              <ShareBar items={LEVEL_ORDER.map((l) => ({ key: l, label: l, value: fo.byLevel[l] || 0, color: LEVEL_COLORS[l] }))} />
              <div className="ad-fo-mix">
                {LEVEL_ORDER.filter((l) => fo.byLevel[l]).map((l) => (
                  <div key={l} className="ad-fo-mix-row">
                    <i className="ad-fo-swatch" style={{ '--sw': LEVEL_COLORS[l] }} />
                    <div className="ad-fo-mix-name">
                      <strong>{l}</strong>
                      <span>{fo.costed.filter((r) => r.level === l).length} subscriptions</span>
                    </div>
                    <div className="ad-fo-mix-val">
                      <strong>{fmtMoney(fo.byLevel[l], { decimals: 0 })}</strong>
                      <span>{Math.round((fo.byLevel[l] / fo.mtd) * 100)}% of spend</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card eyebrow="Top cost drivers" title="Biggest forecast spend this cycle"
            action={<button className="ad-fo-btn is-ghost" onClick={() => setTab('costs')}>All subscriptions <ArrowRight size={13} /></button>}>
            <div className="ad-fo-drivers">
              {[...fo.costed].sort((a, b) => b.forecast - a.forecast).slice(0, 5).map((r, i) => {
                const tone = toneFor(r.forecastUtil);
                return (
                  <button key={r.id} className="ad-fo-driver" onClick={() => inspect(r.id)}>
                    <span className="ad-fo-driver-rank">{i + 1}</span>
                    <span className="ad-fo-driver-name"><strong>{r.name}</strong><small>{r.profile.driver}</small></span>
                    <UtilBar util={r.forecastUtil} pace={1} tone={tone} />
                    <span className="ad-fo-driver-val"><strong>{fmtMoney(r.forecast, { decimals: 0 })}</strong><small className={`is-${tone}`}>{Math.round(r.forecastUtil * 100)}% of budget</small></span>
                  </button>
                );
              })}
            </div>
          </Card>
        </>
      )}

      {/* ============================ ALERTS ============================ */}
      {fo.costed.length > 0 && tab === 'alerts' && (
        <Card eyebrow="Cost alerts" title="Risks to this cycle's budget"
          action={<Segmented size="sm" value={alertFilter} onChange={setAlertFilter} options={[
            { id: 'all', label: `All (${liveAlerts.length})` },
            { id: 'critical', label: 'Critical' },
            { id: 'warning', label: 'Warning' },
            { id: 'info', label: 'Info' }
          ]} />}>
          <div className="ad-fo-alerts">
            {liveAlerts.filter((a) => alertFilter === 'all' || a.severity === alertFilter).map((a) => {
              const S = SEVERITY[a.severity];
              const rec = recForSub(a.subId);
              return (
                <article key={a.id} className={`ad-fo-alert is-${a.severity}`}>
                  <div className="ad-fo-alert-sev"><S.icon size={16} /><span>{S.label}</span></div>
                  <div className="ad-fo-alert-body">
                    <h4>{a.title}</h4>
                    <p>{a.detail}</p>
                    {rec && <div className="ad-fo-alert-fix"><Lightbulb size={12} /> Suggested fix: {rec.title} (~{fmtMoney(rec.monthly, { decimals: 0 })}/mo)</div>}
                  </div>
                  <div className="ad-fo-alert-side">
                    <div className="ad-fo-alert-impact"><strong>{fmtMoney(a.impact, { decimals: 0 })}</strong><span>at risk</span></div>
                    <div className="ad-fo-alert-actions">
                      {rec && <button className="ad-fo-btn is-primary" onClick={() => applyRec(rec)}><Check size={13} /> Apply fix</button>}
                      <button className="ad-fo-btn is-ghost" onClick={() => inspect(a.subId)}><ExternalLink size={13} /> Usage</button>
                      <button className="ad-fo-btn is-icon" title="Snooze 7 days" aria-label="Snooze 7 days" onClick={() => {
                        setSnoozed((prev) => new Set(prev).add(a.id));
                        notify('Alert snoozed for 7 days.', () => setSnoozed((prev) => { const n = new Set(prev); n.delete(a.id); return n; }));
                      }}><BellOff size={13} /></button>
                    </div>
                  </div>
                </article>
              );
            })}
            {liveAlerts.length === 0 && (
              <div className="ad-fo-empty is-inline"><ShieldCheck size={24} /><h4>No open cost alerts</h4><p>Every billable subscription is forecast within budget.</p></div>
            )}
          </div>
          {snoozed.size > 0 && (
            <button className="ad-fo-link" onClick={() => setSnoozed(new Set())}>Restore {snoozed.size} snoozed alert{snoozed.size > 1 ? 's' : ''}</button>
          )}
        </Card>
      )}

      {/* ============================ COSTS TABLE ============================ */}
      {fo.costed.length > 0 && tab === 'costs' && (
        <Card eyebrow="Subscription costs" title="Every billable subscription this cycle"
          action={
            <div className="ad-fo-toolbar">
              <Segmented size="sm" value={costFilter} onChange={setCostFilter} options={[
                { id: 'all', label: 'All' },
                { id: 'metered', label: 'Metered' },
                { id: 'fixed', label: 'Seats & licenses' },
                { id: 'risk', label: 'At risk' }
              ]} />
              <label className="ad-fo-select">
                <span>Sort</span>
                <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
                  <option value="forecast">Forecast</option>
                  <option value="mtd">MTD spend</option>
                  <option value="util">Budget used</option>
                  <option value="trend">Change vs last cycle</option>
                </select>
              </label>
            </div>
          }>
          {(() => {
            const rows = fo.costed
              .filter((r) => costFilter === 'all'
                || (costFilter === 'metered' && r.profile.billing === 'metered')
                || (costFilter === 'fixed' && ['seat', 'license'].includes(r.profile.billing))
                || (costFilter === 'risk' && r.forecastUtil >= 0.95 && r.profile.billing === 'metered'))
              .sort((a, b) => (sortKey === 'util' ? b.forecastUtil - a.forecastUtil : b[sortKey] - a[sortKey]));
            const t = rows.reduce((acc, r) => ({ mtd: acc.mtd + r.mtd, budget: acc.budget + r.budget, forecast: acc.forecast + r.forecast }), { mtd: 0, budget: 0, forecast: 0 });
            return (
              <div className="ad-fo-table-wrap">
                <table className="ad-fo-table">
                  <thead>
                    <tr>
                      <th>Subscription</th><th>Funded by</th><th>Billing</th>
                      <th className="num">MTD</th><th>Budget used</th><th className="num">Forecast</th>
                      <th className="num">vs last cycle</th><th>Last 14 days</th><th aria-label="Actions" />
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => {
                      const tone = r.profile.billing === 'metered' ? toneFor(r.forecastUtil) : 'good';
                      return (
                        <tr key={r.id}>
                          <td><div className="ad-fo-cell-name"><strong>{r.name}</strong><span>{r.category} · {r.profile.driver}</span></div></td>
                          <td><span className={`ad-corner-tag ${r.tagClass}`}>{r.level}</span></td>
                          <td><span className="ad-fo-pill">{BILLING_LABEL[r.profile.billing]}</span></td>
                          <td className="num">{fmtMoney(r.mtd, { decimals: 0 })}</td>
                          <td>
                            <div className="ad-fo-cell-util">
                              <UtilBar util={r.util} pace={fo.pace} tone={tone} />
                              <span>{Math.round(r.util * 100)}%</span>
                            </div>
                          </td>
                          <td className="num"><span className={`ad-fo-num is-${tone}`}>{fmtMoney(r.forecast, { decimals: 0 })}</span><small className="ad-fo-sub">of {fmtMoney(r.budget, { compact: true })}</small></td>
                          <td className="num">{r.profile.billing === 'metered' ? <Delta value={r.trend} suffix="" /> : <span className="ad-fo-muted">Fixed</span>}</td>
                          <td><Sparkline values={r.last14} width={88} height={24} tone={tone === 'bad' ? 'bad' : 'accent'} /></td>
                          <td><button className="ad-fo-btn is-ghost is-sm" onClick={() => onInspect && onInspect(r)}>Usage</button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3}>{rows.length} subscriptions</td>
                      <td className="num">{fmtMoney(t.mtd, { decimals: 0 })}</td>
                      <td>{t.budget ? `${Math.round((t.mtd / t.budget) * 100)}% of ${fmtMoney(t.budget, { compact: true })}` : '—'}</td>
                      <td className="num">{fmtMoney(t.forecast, { decimals: 0 })}</td>
                      <td colSpan={3} />
                    </tr>
                  </tfoot>
                </table>
              </div>
            );
          })()}
          {fo.rows.some((r) => !r.hasCost) && (
            <div className="ad-fo-nocost">
              <span className="ad-fo-muted">No direct charge:</span>
              {fo.rows.filter((r) => !r.hasCost).map((r) => (
                <span key={r.id} className="ad-fo-pill" title={r.profile.driver}>{r.name} · {BILLING_LABEL[r.profile.billing]}</span>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* ============================ TOKENS ============================ */}
      {fo.costed.length > 0 && tab === 'tokens' && (
        <>
          <div className="ad-fo-kpis is-4">
            <Kpi label="LLM tokens MTD" icon={Coins} value={fmtTokens(fo.tokensM)}>
              <span className="ad-fo-muted">{fmtMoney(fo.llmCost, { decimals: 0 })} metered LLM spend</span>
            </Kpi>
            <Kpi label="Cache hit rate" icon={Database} value={fmtPct(fo.cachedM / (fo.tokensM || 1))}>
              <span className="ad-fo-status is-warn"><AlertTriangle size={13} /> Target 45%</span>
            </Kpi>
            <Kpi label="Output share" icon={TrendingUp} value={fmtPct(fo.tokenDaily.reduce((a, d) => a + d.output, 0) / (fo.tokensM || 1))}>
              <span className="ad-fo-muted">Output tokens cost 5× input</span>
            </Kpi>
            <Kpi label="Blended € / 1M" icon={Wallet} value={fmtMoney(fo.costPer1M)}>
              <span className="ad-fo-status is-good"><Check size={13} /> Cache saved {fmtMoney(fo.cacheSavings, { decimals: 0 })}</span>
            </Kpi>
          </div>

          <Card eyebrow="Token analytics" title="Daily LLM tokens by type">
            <Legend items={TokenStackChart.series.map((s) => ({ label: s.label, color: s.color }))} />
            <TokenStackChart data={fo.tokenDaily} />
            <p className="ad-fo-footnote">Cache reads dip from day 15, when the Fusion Confidence Scorer retry loop started sending uncached re-scores.</p>
          </Card>

          <div className="ad-fo-grid-2">
            <Card eyebrow="LLM models" title="Token economics">
              <div className="ad-fo-table-wrap">
                <table className="ad-fo-table is-compact">
                  <thead><tr><th>Model</th><th className="num">Tokens</th><th>Input · Output · Cache</th><th className="num">€/1M in · out</th><th className="num">Effective €/1M</th><th className="num">MTD</th></tr></thead>
                  <tbody>
                    {fo.models.filter((m) => m.kind === 'llm').map((m) => (
                      <tr key={m.id}>
                        <td><div className="ad-fo-cell-name"><strong>{m.name}</strong><span>{m.host}</span></div></td>
                        <td className="num">{fmtTokens(m.tokensM)}</td>
                        <td style={{ minWidth: 140 }}>
                          <ShareBar height={8} items={[
                            { key: 'i', label: 'Input', value: m.mix.input, color: 'var(--fo-s1)' },
                            { key: 'o', label: 'Output', value: m.mix.output, color: 'var(--fo-s2)' },
                            { key: 'c', label: 'Cache read', value: m.mix.cached, color: 'var(--fo-s3)' }
                          ]} />
                        </td>
                        <td className="num">{fmtMoney(m.inRate)} · {fmtMoney(m.outRate)}</td>
                        <td className="num"><strong>{fmtMoney(m.blendedRate)}</strong></td>
                        <td className="num">{fmtMoney(m.cost, { decimals: 0 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            <Card eyebrow="Compute models" title="GPU consumption">
              <div className="ad-fo-mix">
                {fo.models.filter((m) => m.kind === 'compute').map((m) => (
                  <div key={m.id} className="ad-fo-mix-row">
                    <span className="ad-fo-kpi-icon"><Cpu size={14} /></span>
                    <div className="ad-fo-mix-name"><strong>{m.name}</strong><span>{m.host} · {fmtMoney(m.gpuRate)}/GPU-h</span></div>
                    <div className="ad-fo-mix-val"><strong>{Math.round(m.gpuHours).toLocaleString('en-US')} GPU-h</strong><span>{fmtMoney(m.cost, { decimals: 0 })} MTD</span></div>
                  </div>
                ))}
                {!fo.models.some((m) => m.kind === 'compute') && <p className="ad-fo-muted">No compute-billed models in your subscriptions.</p>}
              </div>
            </Card>
          </div>
        </>
      )}

      {/* ============================ OPTIMIZATION ============================ */}
      {fo.costed.length > 0 && tab === 'optimize' && (
        <>
          <div className="ad-fo-savings">
            <div><span className="ad-fo-eyebrow">Open savings</span><strong>{fmtMoney(fo.openSavings, { decimals: 0 })}<small>/mo</small></strong><span className="ad-fo-muted">{fmtMoney(fo.openSavings * 12, { compact: true })} annualised</span></div>
            <div><span className="ad-fo-eyebrow">Applied</span><strong className="is-good">{fmtMoney(fo.appliedSavings, { decimals: 0 })}<small>/mo</small></strong><span className="ad-fo-muted">{fo.recommendations.filter((r) => r.applied).length} of {fo.recommendations.length} actions</span></div>
            <div><span className="ad-fo-eyebrow">Forecast now</span><strong className={`is-${forecastTone}`}>{fmtMoney(fo.forecast, { decimals: 0 })}</strong><span className="ad-fo-muted">vs {fmtMoney(fo.budget, { decimals: 0 })} budget</span></div>
            <button className="ad-fo-btn is-primary" disabled={!openRecs.some((r) => r.effort === 'Low')} onClick={() => {
              const low = openRecs.filter((r) => r.effort === 'Low');
              setApplied((prev) => { const n = new Set(prev); low.forEach((r) => n.add(r.id)); return n; });
              notify(`Applied ${low.length} low-effort optimizations (~${fmtMoney(low.reduce((a, r) => a + r.monthly, 0), { decimals: 0 })}/month).`, () => {
                setApplied((prev) => { const n = new Set(prev); low.forEach((r) => n.delete(r.id)); return n; });
              });
            }}><Sparkles size={13} /> Apply all low-effort</button>
          </div>
          <div className="ad-fo-recs">
            {[...fo.recommendations].sort((a, b) => a.applied - b.applied || b.monthly - a.monthly).map((r) => (
              <article key={r.id} className={`ad-fo-rec ${r.applied ? 'is-applied' : ''}`}>
                <div className="ad-fo-rec-top">
                  <span className="ad-fo-pill">{r.lever}</span>
                  <span className="ad-fo-rec-save"><strong>−{fmtMoney(r.monthly, { decimals: 0 })}</strong>/mo</span>
                </div>
                <h4>{r.title}</h4>
                <div className="ad-fo-rec-sub">{r.subName}</div>
                <p>{r.detail}</p>
                <div className="ad-fo-rec-foot">
                  <span className="ad-fo-muted">Effort <b>{r.effort}</b> · Confidence <b>{r.confidence}</b></span>
                  {r.applied
                    ? <button className="ad-fo-btn is-ghost is-sm" onClick={() => undoRec(r)}><Undo2 size={12} /> Undo</button>
                    : <button className="ad-fo-btn is-primary is-sm" onClick={() => applyRec(r)}><Check size={12} /> Apply</button>}
                </div>
                {r.applied && <div className="ad-fo-rec-badge"><Check size={12} /> Applied, forecast updated</div>}
              </article>
            ))}
          </div>
        </>
      )}

      {/* ============================ GUARDRAILS ============================ */}
      {fo.costed.length > 0 && tab === 'guardrails' && (
        <Card eyebrow="Budget guardrails" title={`${activeRules} of ${guardrails.length} rules enforced on your subscriptions`}>
          <div className="ad-fo-rules">
            {guardrails.map((g) => (
              <div key={g.id} className={`ad-fo-rule ${g.enabled ? 'is-on' : ''}`}>
                <div className="ad-fo-rule-text">
                  <strong>{g.name}</strong>
                  <span>{g.scope} · {g.action}</span>
                </div>
                <span className="ad-fo-pill">{g.kind}</span>
                <button role="switch" aria-checked={g.enabled} aria-label={g.name} className={`ad-fo-switch ${g.enabled ? 'on' : ''}`}
                  onClick={() => {
                    setGuardrails((prev) => prev.map((x) => (x.id === g.id ? { ...x, enabled: !x.enabled } : x)));
                    notify(`${g.enabled ? 'Disabled' : 'Enabled'}: ${g.name}`);
                  }}>
                  <span />
                </button>
              </div>
            ))}
          </div>
          <p className="ad-fo-footnote">Rules at Portfolio and Enterprise scope are inherited and managed by the AI Governance Office.</p>
        </Card>
      )}
    </div>
  );
}
