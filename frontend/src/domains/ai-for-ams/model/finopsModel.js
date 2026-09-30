/**
 * @file FinOps for AI in AMS (F10).
 *
 * The PoC has no billing feed, so spend is estimated from what the studio
 * knows about each agent — lifecycle stage (how much it runs), tier, the model
 * its area uses, how much knowledge it stuffs into prompts, skills (which raise
 * the cache hit rate) and harness runs — with seeded day-to-day variation. All
 * figures are USD, matching the dashboard's cost-per-ticket KPI.
 */

import { amsDashboardData } from '../mockData.js';
import { AMS_AGENT_AREAS, INBOX_APPROVAL_TIER } from './agentOptions';
import { STAGE } from './agentLifecycle';
import { RUN_KIND, RUN_STATUS } from './runModel';
import { createRandom } from '../utils/random';

/** Where a prompt rule applies. */
export const PROMPT_RULE_SCOPES = Object.freeze(['All agents', 'AMS only']);

/** How a prompt rule acts: watch only, suggest, or block non-compliant prompts. */
export const PROMPT_RULE_MODES = Object.freeze(['monitor', 'recommend', 'enforce']);

/** Monthly AI budget cap for AMS, USD. */
export const MONTHLY_BUDGET_CAP = 4000;

/** Model each AMS area runs on (all in the model catalogue). */
export const MODEL_BY_AREA = Object.freeze({
  'incident-triage': 'GPT-4o',
  'problem-rca': 'Claude 3.5 Sonnet',
  'change-release': 'Claude 3.5 Sonnet',
  observability: 'Gemini 1.5 Flash',
  'runbook-automation': 'Claude 3 Haiku'
});

/** List price per 1M tokens, USD (from the catalogue's per-1k prices). */
export const PRICE_PER_MILLION = Object.freeze({
  'GPT-4o': 8,
  'Claude 3.5 Sonnet': 15,
  'Gemini 1.5 Flash': 3,
  'Claude 3 Haiku': 2
});

/** Daily token volume (millions) by lifecycle stage: operating agents run all day, testing agents rarely. */
const DAILY_TOKENS_BY_STAGE = { 9: 2.6, 8: 1.5, 7: 0.6, 6: 0.5, 5: 0.3 };
const TIER_FACTOR = { 'Tier 1': 1.3, 'Tier 2': 1, 'Tier 3': 0.8 };
const TOKENS_PER_HARNESS_RUN = 0.25;

/** Tickets handled per day, from the dashboard (used for AI cost per ticket). */
const TICKETS_PER_DAY = amsDashboardData.overviewStats?.totalIncidentsToday ?? 49;

/**
 * Estimated usage and spend of one agent per day.
 *
 * @param {Object} agent Studio agent.
 * @param {Object[]} runs All runs.
 * @param {number} dayOfMonth Days elapsed this month (for spreading harness runs).
 * @returns {{ model: string, dailyTokensM: number, cacheHitRate: number, dailySpend: number, promptContextShare: number }}
 */
export function estimateAgentDailyUsage(agent, runs, dayOfMonth) {
  const model = MODEL_BY_AREA[agent.area] ?? 'GPT-4o';
  const base = DAILY_TOKENS_BY_STAGE[agent.stage] ?? 0.05;
  const knowledge = (agent.knowledgeSources || []).length;
  const harnessRuns = runs.filter((run) => run.kind === RUN_KIND.HARNESS && run.agentId === agent.id).length;
  const dailyTokensM = base * (1 + knowledge * 0.12) * (TIER_FACTOR[agent.serviceTier] ?? 1)
    + (harnessRuns * TOKENS_PER_HARNESS_RUN) / Math.max(dayOfMonth, 1);
  const cacheHitRate = Math.min(0.45, 0.12 + (agent.skillIds || []).length * 0.05);
  // Cached tokens are billed at half price.
  const dailySpend = dailyTokensM * PRICE_PER_MILLION[model] * (1 - cacheHitRate * 0.5);
  return { model, dailyTokensM, cacheHitRate, dailySpend, promptContextShare: Math.min(0.8, 0.3 + knowledge * 0.1) };
}

/**
 * Calendar facts for the current month.
 *
 * @param {number} now Epoch milliseconds.
 * @returns {{ dayOfMonth: number, daysInMonth: number, monthLabel: string }}
 */
function monthFacts(now) {
  const date = new Date(now);
  return {
    dayOfMonth: date.getDate(),
    daysInMonth: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
    monthLabel: date.toLocaleString('en-GB', { month: 'long', year: 'numeric' })
  };
}

/**
 * @typedef {Object} CostAlert
 * @property {string} id
 * @property {string} agentId
 * @property {string} agentName
 * @property {number} extraCost   Estimated avoidable spend this month, USD.
 * @property {string} reason
 * @property {string} avoid       What to stop doing.
 * @property {string} fix         What to change.
 */

/**
 * Cost alerts: the largest avoidable spend per agent, with the reason, what to avoid and the fix.
 *
 * @param {Array<{ agent: Object, usage: Object, spendMtd: number }>} perAgent
 * @param {Object[]} runs
 * @returns {CostAlert[]}
 */
function buildCostAlerts(perAgent, runs) {
  const alerts = [];
  perAgent.forEach(({ agent, usage, spendMtd }) => {
    if (spendMtd < 20) return;
    if ((agent.knowledgeSources || []).length >= 4 && (agent.skillIds || []).length < 3) {
      alerts.push({
        id: `${agent.id}-context`,
        agentId: agent.id,
        agentName: agent.name,
        extraCost: spendMtd * 0.18,
        reason: `Sends all ${agent.knowledgeSources.length} knowledge sources in every prompt (${Math.round(usage.promptContextShare * 100)}% of tokens are context).`,
        avoid: 'Pasting whole log excerpts and CMDB records into prompts.',
        fix: 'Retrieve the top 5 relevant chunks and summarise logs before prompting.'
      });
    }
    if (usage.model === 'Claude 3.5 Sonnet' && agent.serviceTier !== INBOX_APPROVAL_TIER) {
      alerts.push({
        id: `${agent.id}-model`,
        agentId: agent.id,
        agentName: agent.name,
        extraCost: spendMtd * 0.35,
        reason: `Uses a premium model (${usage.model}) for a ${agent.serviceTier || 'non-critical'} service.`,
        avoid: 'Routing routine classification and lookups to the premium model.',
        fix: 'Route first-pass steps to Claude 3 Haiku and escalate only low-confidence cases.'
      });
    }
    if (usage.cacheHitRate < 0.2) {
      alerts.push({
        id: `${agent.id}-cache`,
        agentId: agent.id,
        agentName: agent.name,
        extraCost: spendMtd * 0.1,
        reason: `Cache hit rate only ${Math.round(usage.cacheHitRate * 100)}% — repeat incidents are answered from scratch.`,
        avoid: 'Re-running full analysis for incidents already seen this week.',
        fix: 'Attach reusable skills and enable semantic caching for repeat incidents.'
      });
    }
    const failedRuns = runs.filter((run) => run.agentId === agent.id && run.status === RUN_STATUS.FAILED).length;
    if (failedRuns > 0) {
      alerts.push({
        id: `${agent.id}-failed`,
        agentId: agent.id,
        agentName: agent.name,
        extraCost: failedRuns * TOKENS_PER_HARNESS_RUN * PRICE_PER_MILLION[usage.model],
        reason: `${failedRuns} harness run(s) failed the quality gate and their tokens were wasted.`,
        avoid: 'Re-running an agent that fails the quality gate without changing it.',
        fix: 'Bind more knowledge sources in Agent Studio before the next run.'
      });
    }
  });
  // One alert per agent — its most expensive issue — so the list stays actionable.
  const topPerAgent = new Map();
  alerts.forEach((alert) => {
    const current = topPerAgent.get(alert.agentId);
    if (!current || alert.extraCost > current.extraCost) topPerAgent.set(alert.agentId, alert);
  });
  return [...topPerAgent.values()].sort((a, b) => b.extraCost - a.extraCost);
}

/**
 * Full FinOps picture for the month.
 *
 * @param {import('../state/seedState').AmsStudioState} state
 * @param {number} now Epoch milliseconds.
 * @param {Set<string> | null} [agentScope] Restrict to these agent ids (active programme).
 * @returns {Object} Summary KPIs, daily burn, breakdowns, per-agent costs and alerts.
 */
export function getFinOpsSummary(state, now, agentScope = null) {
  const { dayOfMonth, daysInMonth, monthLabel } = monthFacts(now);
  const agents = state.studioAgents.filter((agent) => agent.stage >= STAGE.HARNESS && (!agentScope || agentScope.has(agent.id)));

  const perAgent = agents.map((agent) => {
    const usage = estimateAgentDailyUsage(agent, state.runs, dayOfMonth);
    return { agent, usage, spendMtd: usage.dailySpend * dayOfMonth, tokensMtdM: usage.dailyTokensM * dayOfMonth };
  }).sort((a, b) => b.spendMtd - a.spendMtd);

  const baseDaily = perAgent.reduce((sum, entry) => sum + entry.usage.dailySpend, 0);
  const random = createRandom(dayOfMonth * 7919 + daysInMonth);
  let cumulative = 0;
  const days = [];
  for (let day = 1; day <= daysInMonth; day += 1) {
    const weekday = new Date(new Date(now).getFullYear(), new Date(now).getMonth(), day).getDay();
    const weekendFactor = weekday === 0 || weekday === 6 ? 0.7 : 1.05;
    const spend = baseDaily * weekendFactor * (0.88 + random.next() * 0.24);
    cumulative += spend;
    days.push({ day, spend, cumulative, forecast: day > dayOfMonth });
  }

  // Scale the simulated curve so month-to-date equals the per-agent total.
  const mtdEstimate = perAgent.reduce((sum, entry) => sum + entry.spendMtd, 0);
  const curveMtd = days[dayOfMonth - 1]?.cumulative || 1;
  const scale = mtdEstimate / curveMtd;
  days.forEach((entry) => { entry.spend *= scale; entry.cumulative *= scale; });

  const mtdSpend = days[dayOfMonth - 1]?.cumulative ?? 0;
  const forecast = days[daysInMonth - 1]?.cumulative ?? 0;
  const tokensMtdM = perAgent.reduce((sum, entry) => sum + entry.tokensMtdM, 0);
  const listPriceSpend = perAgent.reduce((sum, entry) => sum + entry.tokensMtdM * PRICE_PER_MILLION[entry.usage.model], 0);
  const alerts = buildCostAlerts(perAgent, state.runs);
  const avoidable = alerts.reduce((sum, alert) => sum + alert.extraCost, 0);

  const byArea = AMS_AGENT_AREAS.map((area) => ({
    id: area.id,
    label: area.label,
    spend: perAgent.filter((entry) => entry.agent.area === area.id).reduce((sum, entry) => sum + entry.spendMtd, 0)
  })).filter((entry) => entry.spend > 0).sort((a, b) => b.spend - a.spend);

  const byModel = Object.keys(PRICE_PER_MILLION).map((model) => ({
    id: model,
    label: model,
    spend: perAgent.filter((entry) => entry.usage.model === model).reduce((sum, entry) => sum + entry.spendMtd, 0)
  })).filter((entry) => entry.spend > 0).sort((a, b) => b.spend - a.spend);

  const ticketsMtd = TICKETS_PER_DAY * dayOfMonth;
  return {
    monthLabel,
    dayOfMonth,
    daysInMonth,
    cap: MONTHLY_BUDGET_CAP,
    mtdSpend,
    forecast,
    tokensMtdM,
    budgetUsedPct: (mtdSpend / MONTHLY_BUDGET_CAP) * 100,
    costPerMillion: tokensMtdM > 0 ? mtdSpend / tokensMtdM : 0,
    cacheSavings: Math.max(0, listPriceSpend - mtdSpend),
    efficiencyIndex: Math.round(Math.max(0, Math.min(100, 100 - (avoidable / Math.max(mtdSpend, 1)) * 100))),
    days,
    byArea,
    byModel,
    perAgent,
    alerts,
    aiCostPerTicket: ticketsMtd > 0 ? mtdSpend / ticketsMtd : 0,
    costPerTicket: amsDashboardData.productivityAndCostReduction.costPerTicket,
    baselineCostPerTicket: amsDashboardData.productivityAndCostReduction.baselineCostPerTicket
  };
}

/**
 * Formats USD, e.g. "$1,284", "$0.38" for small amounts, "$0" for zero.
 *
 * @param {number} value
 * @returns {string}
 */
export function formatUsd(value) {
  const digits = value !== 0 && Math.abs(value) < 10 ? 2 : 0;
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
}
