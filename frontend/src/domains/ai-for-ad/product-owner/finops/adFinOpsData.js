/**
 * AI for AD — My Subscriptions · FinOps
 * Cost profiles keyed by subscription id (see AdMySubscriptions INITIAL_SUBSCRIPTIONS).
 * Every figure on the FinOps view is derived from the *live* subscription list,
 * so unsubscribing an item removes its spend, alerts and recommendations.
 */

export const CURRENCY = '€';
export const CYCLE = { label: '01–30 Sep 2026', days: 30, today: 22, month: 'Sep' };

// Sep 1 2026 is a Tuesday → day d falls on weekday (d + 1) % 7 (0 = Sunday)
export const isWeekend = (d) => { const w = (d + 1) % 7; return w === 0 || w === 6; };

// Mock list prices (EUR per 1M tokens) for metered LLM usage
export const MODELS = {
  sonnet: { id: 'sonnet', name: 'Claude Sonnet 5', host: 'AWS Bedrock · EU Frankfurt', kind: 'llm', inRate: 2.8, outRate: 14, cacheRate: 0.28, mix: { input: 0.64, output: 0.09, cached: 0.27 } },
  haiku: { id: 'haiku', name: 'Claude Haiku 4.5', host: 'AWS Bedrock · EU Frankfurt', kind: 'llm', inRate: 0.95, outRate: 4.7, cacheRate: 0.09, mix: { input: 0.58, output: 0.12, cached: 0.30 } },
  vit: { id: 'vit', name: 'VisionTransformer v2', host: 'NVIDIA DRIVE Orin · Edge', kind: 'compute', gpuRate: 3.1 },
  radar: { id: 'radar', name: 'Radar Fusion Model v3', host: 'On-prem GPU · Balocco', kind: 'compute', gpuRate: 2.4 }
};
export const MODEL_ORDER = ['sonnet', 'haiku', 'vit', 'radar'];

/**
 * billing: metered (usage-based) · seat · license (fixed, amortised daily) · center (cost center) · included (no direct cost)
 * mtd is spend up to CYCLE.today; prevMtd is last cycle at the same day.
 */
export const COST_PROFILES = {
  'sub-mod-1': { billing: 'metered', mtd: 3480, budget: 5200, prevMtd: 3120, models: { sonnet: 1 }, driver: 'Requirement drafting & ISO 26262 test synthesis' },
  'sub-mod-2': { billing: 'metered', mtd: 1860, budget: 2600, prevMtd: 1910, models: { vit: 1 }, driver: 'On-vehicle inference, proving-ground fleet', weekend: 0.8 },
  'sub-mod-3': { billing: 'metered', mtd: 1240, budget: 1800, prevMtd: 1180, models: { radar: 1 }, driver: 'Radar point-cloud arbitration pipeline', weekend: 0.85 },
  'sub-agt-1': { billing: 'metered', mtd: 2140, budget: 2300, prevMtd: 1490, models: { sonnet: 0.85, haiku: 0.15 }, driver: 'Detection scoring · retries on low-confidence frames', surgeFrom: 15, surge: 1.9 },
  'sub-agt-2': { billing: 'metered', mtd: 980, budget: 1500, prevMtd: 1060, models: { sonnet: 0.7, haiku: 0.3 }, driver: 'Story refinement from Euro NCAP specs' },
  'sub-wf-1': { billing: 'metered', mtd: 1320, budget: 1650, prevMtd: 1150, models: { sonnet: 0.4, vit: 0.3, radar: 0.3 }, driver: 'Multi-agent radar + camera orchestration', weekend: 0.7 },
  'sub-tool-1': { billing: 'seat', mtd: 429, budget: 585, prevMtd: 429, seats: 15, seatsUsed: 12, seatPrice: 39, driver: '15 seats × €39 / month' },
  'sub-tool-2': { billing: 'license', mtd: 1760, budget: 2400, prevMtd: 1760, driver: 'Enterprise site license, 4 HIL rigs' },
  'sub-tool-3': { billing: 'license', mtd: 880, budget: 1200, prevMtd: 880, driver: 'Annual license €14.4K, amortised monthly' },
  'sub-tool-4': { billing: 'metered', mtd: 164, budget: 250, prevMtd: 151, models: { haiku: 1 }, driver: 'Drift detection on VTv2 alert stream' },
  'sub-proj-1': { billing: 'center', driver: 'Cost center: charges roll up from linked subscriptions' },
  'sub-proj-2': { billing: 'center', driver: 'Cost center: R&D sandbox allocation' },
  'sub-proj-3': { billing: 'center', driver: 'Cost center: sustaining fleet operations' },
  'sub-notif-1': { billing: 'metered', mtd: 18, budget: 40, prevMtd: 17, models: { haiku: 1 }, driver: 'Real-time push routing' },
  'sub-notif-2': { billing: 'metered', mtd: 26, budget: 40, prevMtd: 26, models: { haiku: 1 }, driver: 'Daily digest generation' },
  'sub-gov-1': { billing: 'included', driver: 'Policy, no direct charge' },
  'sub-gov-2': { billing: 'included', driver: 'Policy, no direct charge' },
  'sub-dash-1': { billing: 'metered', mtd: 96, budget: 150, prevMtd: 90, models: { haiku: 1 }, driver: 'CI/CD + HIL rig sync refresh' },
  'sub-dash-2': { billing: 'metered', mtd: 72, budget: 120, prevMtd: 74, models: { haiku: 1 }, driver: 'Weekly audit rollup' },
  'sub-dash-3': { billing: 'metered', mtd: 164, budget: 200, prevMtd: 88, models: { haiku: 1 }, driver: 'Hourly group-wide telemetry refresh', surgeFrom: 12, surge: 1.7 }
};

export const BILLING_LABEL = { metered: 'Metered', seat: 'Per seat', license: 'License', center: 'Cost center', included: 'Included' };
export const LEVEL_ORDER = ['Individual', 'Team', 'Project', 'Portfolio', 'Enterprise'];

/** Optimisation playbook. `pct` applies to the subscription's remaining-cycle run-rate; `flat` is a fixed monthly saving. */
export const RECOMMENDATIONS = [
  { id: 'rec-retry', subId: 'sub-agt-1', title: 'Cap retries on low-confidence frames', detail: 'Retry loop introduced on day 15 re-scores the same frame up to 6×. Capping at 2 retries restores last-cycle cost without precision loss (A/B: −0.3 pp).', pct: 0.38, effort: 'Low', confidence: 'High', lever: 'Agent config' },
  { id: 'rec-route', subId: 'sub-mod-1', title: 'Route short prompts to Claude Haiku 4.5', detail: '41% of Sonnet 5 calls are < 2K tokens (classification, field extraction). Routing them to Haiku 4.5 keeps quality within eval threshold.', pct: 0.22, effort: 'Medium', confidence: 'High', lever: 'Model routing' },
  { id: 'rec-cache', subId: 'sub-agt-2', title: 'Enable prompt caching on spec system prompts', detail: 'Every run resends a 6.2K-token Euro NCAP system prompt. Cache hit rate is 19% vs a 45% target.', pct: 0.18, effort: 'Low', confidence: 'High', lever: 'Prompt caching' },
  { id: 'rec-maxtok', subId: 'sub-wf-1', title: 'Set max_tokens ceiling on orchestration steps', detail: 'p95 output is 3.1× the median on the arbitration step. A 2,048-token ceiling trims runaway completions.', pct: 0.12, effort: 'Low', confidence: 'Medium', lever: 'Token limits' },
  { id: 'rec-weekend', subId: 'sub-mod-2', title: 'Scale edge reservation down on weekends', detail: 'Proving-ground fleet is parked on weekends, yet the reserved Orin capacity stays at 80% of weekday level.', pct: 0.14, effort: 'Medium', confidence: 'Medium', lever: 'Capacity schedule' },
  { id: 'rec-refresh', subId: 'sub-dash-3', title: 'Refresh usage dashboard every 6h instead of hourly', detail: 'Refresh cadence moved to hourly on day 12; readers open it twice a day on average.', pct: 0.45, effort: 'Low', confidence: 'High', lever: 'Refresh cadence' },
  { id: 'rec-seats', subId: 'sub-tool-1', title: 'Release 3 idle CodePilot Pro seats at renewal', detail: '3 of 15 seats show no activity in 30 days. Renewal is due in 14 days, so resize before it auto-renews.', flat: 117, effort: 'Low', confidence: 'High', lever: 'Seat right-sizing' }
];

export const GUARDRAILS = [
  { id: 'g-soft', name: 'Soft alert at 80% of subscription budget', scope: 'All subscriptions', action: 'Notify → Workflow Inbox', enabled: true, kind: 'budget' },
  { id: 'g-hard', name: 'Hard stop at 100% for Individual scope', scope: 'Individual', action: 'Block new calls, request top-up', enabled: true, kind: 'budget' },
  { id: 'g-approve', name: 'Approval required for upgrades over €1,000', scope: 'Team · Project', action: 'Route to AD Architect', enabled: true, kind: 'approval' },
  { id: 'g-anomaly', name: 'Daily spend anomaly above 2σ of 14-day mean', scope: 'Metered', action: 'Alert + tag owner', enabled: true, kind: 'anomaly' },
  { id: 'g-maxtok', name: 'max_tokens ceiling of 4,096 on agent calls', scope: 'Agents · Workflows', action: 'Truncate + log', enabled: true, kind: 'tokens' },
  { id: 'g-route', name: 'Auto-route prompts under 2K tokens to Haiku 4.5', scope: 'Models', action: 'Rewrite model id', enabled: false, kind: 'routing' },
  { id: 'g-cache', name: 'Enforce prompt cache for system prompts over 1K tokens', scope: 'Agents', action: 'Inject cache_control', enabled: false, kind: 'tokens' },
  { id: 'g-weekend', name: 'Weekend compute scale-down to 40%', scope: 'Edge models', action: 'Adjust reservation', enabled: false, kind: 'capacity' }
];

/* ------------------------------------------------------------------ */
/* Derivation helpers                                                  */
/* ------------------------------------------------------------------ */

// Deterministic pseudo-noise so charts don't jitter between renders
const noise = (seed, d) => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const x = Math.sin(h * 0.001 + d * 12.9898) * 43758.5453;
  return 0.88 + (x - Math.floor(x)) * 0.24;
};

/** Relative daily weight of a metered profile for day d (weekend dip, surge, noise). */
const weight = (id, p, d) => {
  let w = noise(id, d);
  if (isWeekend(d)) w *= p.weekend ?? 0.42;
  if (p.surgeFrom && d >= p.surgeFrom) w *= p.surge;
  return w;
};

/** 30-day daily spend for one subscription; days after `today` are forecast. */
export function dailySeries(id, p, savingPct = 0) {
  const { days, today } = CYCLE;
  if (!p || p.mtd == null) return new Array(days).fill(0);
  if (p.billing !== 'metered') {
    const perDay = p.mtd / today;
    return Array.from({ length: days }, (_, i) => (i + 1 > today ? perDay * (1 - savingPct) : perDay));
  }
  const w = Array.from({ length: days }, (_, i) => weight(id, p, i + 1));
  const base = p.mtd / w.slice(0, today).reduce((a, b) => a + b, 0);
  return w.map((x, i) => (i + 1 > today ? x * base * (1 - savingPct) : x * base));
}

const prevSeries = (id, p) => {
  if (!p || p.prevMtd == null) return new Array(CYCLE.days).fill(0);
  const flat = { ...p, surgeFrom: null, mtd: p.prevMtd };
  return dailySeries(`${id}-prev`, flat);
};

const sum = (arr) => arr.reduce((a, b) => a + b, 0);

/**
 * Build the complete FinOps model for the current subscription list.
 * applied: Set of recommendation ids already actioned (lowers forecast).
 */
export function buildFinOps(subscriptions, applied = new Set()) {
  const { days, today } = CYCLE;
  const recs = RECOMMENDATIONS.filter((r) => subscriptions.some((s) => s.id === r.subId));

  const savingBySub = {};
  const flatBySub = {};
  recs.filter((r) => applied.has(r.id)).forEach((r) => {
    if (r.pct) savingBySub[r.subId] = 1 - (1 - (savingBySub[r.subId] || 0)) * (1 - r.pct);
    if (r.flat) flatBySub[r.subId] = (flatBySub[r.subId] || 0) + r.flat;
  });

  const rows = subscriptions.map((s) => {
    const p = COST_PROFILES[s.id] || { billing: 'included', driver: '—' };
    const hasCost = p.mtd != null;
    const series = dailySeries(s.id, p, savingBySub[s.id] || 0);
    const flatCut = ((flatBySub[s.id] || 0) * (days - today)) / days;
    const forecast = hasCost ? sum(series) - flatCut : 0;
    const last14 = series.slice(today - 14, today);
    const runRate7 = hasCost ? sum(series.slice(today - 7, today)) / 7 : 0;
    const util = hasCost ? p.mtd / p.budget : 0;
    const forecastUtil = hasCost ? forecast / p.budget : 0;
    const trend = hasCost && p.prevMtd ? (p.mtd - p.prevMtd) / p.prevMtd : 0;
    return { ...s, profile: p, hasCost, series, forecast, last14, runRate7, util, forecastUtil, trend, mtd: p.mtd || 0, budget: p.budget || 0 };
  });

  const costed = rows.filter((r) => r.hasCost);
  const daily = Array.from({ length: days }, (_, i) => sum(costed.map((r) => r.series[i])));
  const flatTotal = sum(costed.map((r) => ((flatBySub[r.id] || 0) * (days - today)) / days));
  const prevDaily = Array.from({ length: days }, (_, i) => sum(costed.map((r) => prevSeries(r.id, r.profile)[i])));

  const mtd = sum(costed.map((r) => r.mtd));
  const prevMtd = sum(costed.map((r) => r.profile.prevMtd || 0));
  const budget = sum(costed.map((r) => r.budget));
  const forecast = sum(daily) - flatTotal;
  const pace = today / days;

  // Model mix (metered only)
  const modelCost = {};
  costed.filter((r) => r.profile.models).forEach((r) => {
    Object.entries(r.profile.models).forEach(([m, share]) => {
      modelCost[m] = (modelCost[m] || 0) + r.mtd * share;
    });
  });
  const blended = (m) => m.mix.input * m.inRate + m.mix.output * m.outRate + m.mix.cached * m.cacheRate;
  const models = MODEL_ORDER.filter((id) => modelCost[id]).map((id) => {
    const m = MODELS[id];
    const cost = modelCost[id];
    const tokensM = m.kind === 'llm' ? cost / blended(m) : null;
    const gpuHours = m.kind === 'compute' ? cost / m.gpuRate : null;
    return { ...m, cost, tokensM, gpuHours, blendedRate: m.kind === 'llm' ? blended(m) : null };
  });
  const llm = models.filter((m) => m.kind === 'llm');
  const tokensM = sum(llm.map((m) => m.tokensM));
  const llmCost = sum(llm.map((m) => m.cost));
  const cachedM = sum(llm.map((m) => m.tokensM * m.mix.cached));
  const cacheSavings = sum(llm.map((m) => m.tokensM * m.mix.cached * (m.inRate - m.cacheRate)));

  // Daily token split for Token Analytics (proportional to LLM share of daily spend)
  const llmShare = mtd ? llmCost / mtd : 0;
  const tokenDaily = daily.slice(0, today).map((v, i) => {
    const t = tokensM ? (v * llmShare * tokensM) / (llmCost || 1) : 0;
    const cachedBoost = i >= 15 ? 0.94 : 1; // cache hit dips when the retry surge starts
    const cached = t * (cachedM / (tokensM || 1)) * cachedBoost;
    const output = t * 0.1;
    return { day: i + 1, input: t - cached - output, output, cached };
  });

  // Spend by category & by funding level
  const byCategory = {};
  const byLevel = {};
  costed.forEach((r) => {
    byCategory[r.category] = (byCategory[r.category] || 0) + r.mtd;
    byLevel[r.level] = (byLevel[r.level] || 0) + r.mtd;
  });

  // Alerts
  const alerts = [];
  rows.forEach((r) => {
    if (!r.hasCost) return;
    if (r.forecastUtil > 1) {
      alerts.push({ id: `a-over-${r.id}`, severity: 'critical', subId: r.id, title: `${r.name} will exceed budget`, detail: `Forecast ${fmtMoney(r.forecast)} vs ${fmtMoney(r.budget)} budget (${Math.round(r.forecastUtil * 100)}%).`, impact: r.forecast - r.budget });
    } else if (r.forecastUtil >= 0.95 && r.profile.billing === 'metered') {
      alerts.push({ id: `a-soft-${r.id}`, severity: 'warning', subId: r.id, title: `${r.name} is tracking close to budget`, detail: `${Math.round(r.util * 100)}% used on day ${today} of ${days} (pace ${Math.round(pace * 100)}%). Forecast lands at ${Math.round(r.forecastUtil * 100)}% of budget.`, impact: Math.max(0, r.forecast - r.budget * 0.9) });
    }
    if (r.profile.surgeFrom && !(savingBySub[r.id] > 0)) {
      alerts.push({ id: `a-surge-${r.id}`, severity: 'warning', subId: r.id, title: `Spend spike on ${r.name}`, detail: `Daily run-rate up ${Math.round((r.profile.surge - 1) * 100)}% since day ${r.profile.surgeFrom}. ${r.profile.driver}.`, impact: r.runRate7 * (days - today) * (1 - 1 / r.profile.surge) });
    }
    if (r.profile.billing === 'seat' && r.profile.seats > r.profile.seatsUsed && !flatBySub[r.id]) {
      const idle = r.profile.seats - r.profile.seatsUsed;
      alerts.push({ id: `a-idle-${r.id}`, severity: 'info', subId: r.id, title: `${idle} idle seats on ${r.name}`, detail: `${idle} of ${r.profile.seats} seats unused for 30 days. ${r.isExpiring ? 'License renews soon.' : ''}`, impact: idle * r.profile.seatPrice });
    }
  });
  const sevRank = { critical: 0, warning: 1, info: 2 };
  alerts.sort((a, b) => sevRank[a.severity] - sevRank[b.severity] || b.impact - a.impact);

  const recommendations = recs.map((rec) => {
    const row = rows.find((r) => r.id === rec.subId);
    const monthly = rec.flat ?? (row ? row.runRate7 * days * rec.pct : 0);
    return { ...rec, subName: row?.name, monthly, applied: applied.has(rec.id) };
  });
  const openSavings = sum(recommendations.filter((r) => !r.applied).map((r) => r.monthly));
  const appliedSavings = sum(recommendations.filter((r) => r.applied).map((r) => r.monthly));

  // Efficiency score: budget discipline + cache usage + open waste
  const efficiency = Math.round(
    Math.max(0, Math.min(100, 100 - Math.max(0, forecast / budget - 0.9) * 120 - (openSavings / (forecast || 1)) * 90 + (cachedM / (tokensM || 1)) * 20))
  );

  return {
    rows, costed, daily, prevDaily, mtd, prevMtd, budget, forecast, pace,
    models, tokensM, cachedM, cacheSavings, llmCost, tokenDaily,
    byCategory, byLevel, alerts, recommendations, openSavings, appliedSavings, efficiency,
    invocations: Math.round(tokensM * 1e6 / 3850),
    costPer1M: tokensM ? llmCost / tokensM : 0
  };
}

export function fmtMoney(v, { compact = false, decimals } = {}) {
  if (v == null || Number.isNaN(v)) return '—';
  const sign = v < 0 ? '−' : '';
  const a = Math.abs(v);
  if (compact && a >= 1000) return `${sign}${CURRENCY}${(a / 1000).toFixed(a >= 10000 ? 0 : 1)}K`;
  const d = decimals ?? (a < 100 ? 2 : 0);
  return `${sign}${CURRENCY}${a.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })}`;
}

export function fmtTokens(m) {
  if (m == null) return '—';
  if (m >= 1000) return `${(m / 1000).toFixed(2)}B`;
  if (m >= 1) return `${m.toFixed(1)}M`;
  return `${Math.round(m * 1000)}K`;
}

export const fmtPct = (v, d = 0) => `${(v * 100).toFixed(d)}%`;
