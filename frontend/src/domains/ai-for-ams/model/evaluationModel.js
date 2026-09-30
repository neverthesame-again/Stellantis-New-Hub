/**
 * @file AMS agent evaluation model (F6).
 *
 * Defines the measures every agent is scored on, the platform rules, the
 * (simulated) scoring used by "Run evaluation", rule-violation checks and the
 * rule-pack parser. Pure functions only.
 */

import { CONNECTION_STATUS } from './agentOptions';

/** Default platform pass mark; an admin can change it in the Evaluation center. */
export const DEFAULT_PASS_MARK = 85;

/** Allowed range for the platform pass mark. */
export const PASS_MARK_RANGE = Object.freeze({ min: 50, max: 100 });

/** Measures every AMS agent is scored on (0–100, higher is better). */
export const EVALUATION_MEASURES = Object.freeze([
  { id: 'incidentAccuracy', label: 'Incident accuracy' },
  { id: 'rcaQuality', label: 'RCA quality' },
  { id: 'knowledgeQuality', label: 'Knowledge quality' },
  { id: 'groundedness', label: 'Groundedness' },
  { id: 'hallucination', label: 'Hallucination control', hint: 'Higher means fewer unsupported claims' },
  { id: 'security', label: 'Security' },
  { id: 'cost', label: 'Cost efficiency' },
  { id: 'latency', label: 'Latency' }
]);

const MEASURE_IDS = new Set(EVALUATION_MEASURES.map((measure) => measure.id));

/**
 * @typedef {Object} EvaluationRule
 * @property {string} id
 * @property {string} name
 * @property {string} measure    One of {@link EVALUATION_MEASURES} ids.
 * @property {number} threshold  Minimum acceptable score for the measure.
 * @property {boolean} blocking  Blocking rules stop an agent leaving the evaluation stage.
 * @property {string} source     "Platform" or the rule-pack file name.
 */

/** @type {ReadonlyArray<EvaluationRule>} */
export const DEFAULT_EVALUATION_RULES = Object.freeze([
  { id: 'RULE-SEC-01', name: 'No unmasked PII or secrets in agent output', measure: 'security', threshold: 90, blocking: true, source: 'Platform' },
  { id: 'RULE-GRD-01', name: 'Answers are grounded in cited incident evidence', measure: 'groundedness', threshold: 85, blocking: true, source: 'Platform' },
  { id: 'RULE-HAL-01', name: 'Unsupported root-cause claims stay rare', measure: 'hallucination', threshold: 85, blocking: true, source: 'Platform' },
  { id: 'RULE-ACC-01', name: 'Incident classification matches the resolver group', measure: 'incidentAccuracy', threshold: 80, blocking: false, source: 'Platform' },
  { id: 'RULE-LAT-01', name: 'Responds within the triage SLA', measure: 'latency', threshold: 85, blocking: false, source: 'Platform' },
  { id: 'RULE-CST-01', name: 'Token spend within the service budget', measure: 'cost', threshold: 80, blocking: false, source: 'Platform' }
]);

/**
 * @param {string} measureId
 * @returns {string}
 */
export function getMeasureLabel(measureId) {
  return EVALUATION_MEASURES.find((measure) => measure.id === measureId)?.label ?? measureId;
}

const clampScore = (value) => Math.max(0, Math.min(100, Math.round(value)));
const countOf = (list, cap) => Math.min(Array.isArray(list) ? list.length : 0, cap);

/**
 * Scores an agent. The PoC has no live evaluation harness, so scores are
 * derived from how well the agent is equipped (knowledge, tools, skills,
 * runtime latency, PII masking, tier) plus a small run-to-run variation.
 *
 * @param {Object} agent Studio agent.
 * @param {number[]} jitter One value in [-1, 1] per measure, supplied by the caller
 *   so this function stays deterministic.
 * @returns {{ scores: Record<string, number>, score: number }} Per-measure scores and their average.
 */
export function computeEvaluationScores(agent, jitter) {
  const knowledge = countOf(agent.knowledgeSources, 5);
  const tools = countOf(agent.connectedTools, 4);
  const skills = countOf(agent.skillIds, 4);
  const latencyMs = agent.runtime?.connectionStatus === CONNECTION_STATUS.CONNECTED ? agent.runtime.latencyMs ?? 150 : 250;
  const tierCost = { 'Tier 1': 84, 'Tier 2': 88, 'Tier 3': 92 }[agent.serviceTier] ?? 85;

  const base = {
    incidentAccuracy: 78 + knowledge * 3 + (skills > 0 ? 2 : 0),
    rcaQuality: 76 + knowledge * 2 + tools * 2,
    knowledgeQuality: 68 + knowledge * 5,
    groundedness: 80 + knowledge * 2,
    hallucination: 82 + skills * 2,
    security: agent.piiMaskingEnabled ? 93 : 78,
    cost: tierCost,
    latency: latencyMs < 100 ? 95 : latencyMs < 200 ? 88 : 79
  };

  const scores = Object.fromEntries(EVALUATION_MEASURES.map(({ id }, index) => (
    [id, clampScore(base[id] + (jitter[index] ?? 0) * 3)]
  )));
  const values = Object.values(scores);
  return { scores, score: clampScore(values.reduce((sum, value) => sum + value, 0) / values.length) };
}

/**
 * Rules the agent's latest evaluation breaks. Returns nothing for agents that
 * have not been evaluated.
 *
 * @param {Object} agent
 * @param {EvaluationRule[]} rules
 * @returns {EvaluationRule[]}
 */
export function getRuleViolations(agent, rules) {
  const scores = agent.evaluation?.scores;
  if (!scores) return [];
  return rules.filter((rule) => (scores[rule.measure] ?? 0) < rule.threshold);
}

/**
 * Whether the agent has been evaluated, meets the pass mark and breaks no blocking rule.
 *
 * @param {Object} agent
 * @param {{ passMark: number, rules: EvaluationRule[] }} context
 * @returns {boolean}
 */
export function passesEvaluation(agent, { passMark, rules }) {
  return agent.evaluation?.score !== undefined
    && agent.evaluation.score >= passMark
    && getRuleViolations(agent, rules).every((rule) => !rule.blocking);
}

/**
 * Average score per measure across evaluated agents.
 *
 * @param {Object[]} agents
 * @returns {{ averages: Record<string, number | null>, evaluatedCount: number }}
 */
export function averageScoresByMeasure(agents) {
  const evaluated = agents.filter((agent) => agent.evaluation?.scores);
  const averages = Object.fromEntries(EVALUATION_MEASURES.map(({ id }) => {
    if (evaluated.length === 0) return [id, null];
    const total = evaluated.reduce((sum, agent) => sum + (agent.evaluation.scores[id] ?? 0), 0);
    return [id, Math.round(total / evaluated.length)];
  }));
  return { averages, evaluatedCount: evaluated.length };
}

/**
 * Parses the value side of a `key: value` line in the YAML subset.
 *
 * @param {string} raw
 * @returns {string | number | boolean}
 */
function parseYamlScalar(raw) {
  const value = raw.trim().replace(/^['"]|['"]$/g, '');
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value !== '' && !Number.isNaN(Number(value))) return Number(value);
  return value;
}

/**
 * Reads the YAML subset used by rule packs: a list of flat maps, optionally
 * under a top-level `rules:` key.
 *
 * ```yaml
 * rules:
 *   - id: RULE-SEC-02
 *     name: Mask VINs in log excerpts
 *     measure: security
 *     threshold: 92
 *     blocking: true
 * ```
 *
 * @param {string} text
 * @returns {Object[]}
 */
function parseYamlRuleList(text) {
  const items = [];
  let current = null;
  text.split(/\r?\n/).forEach((line) => {
    const trimmed = line.replace(/#.*$/, '').trimEnd();
    if (!trimmed.trim() || /^rules:\s*$/.test(trimmed.trim())) return;
    const itemStart = trimmed.match(/^\s*-\s+(\w+)\s*:\s*(.*)$/);
    const field = trimmed.match(/^\s+(\w+)\s*:\s*(.*)$/);
    if (itemStart) {
      current = { [itemStart[1]]: parseYamlScalar(itemStart[2]) };
      items.push(current);
    } else if (field && current) {
      current[field[1]] = parseYamlScalar(field[2]);
    }
  });
  return items;
}

/**
 * Parses and validates an uploaded rule pack (JSON or the YAML subset above).
 * Invalid rules are reported and skipped; valid ones are returned.
 *
 * @param {string} text     File contents.
 * @param {string} fileName Used to pick the format and recorded as the rules' source.
 * @returns {{ rules: EvaluationRule[], errors: string[] }}
 */
export function parseRulePack(text, fileName) {
  let rawRules;
  try {
    if (/\.json$/i.test(fileName)) {
      const parsed = JSON.parse(text);
      rawRules = Array.isArray(parsed) ? parsed : parsed?.rules;
    } else {
      rawRules = parseYamlRuleList(text);
    }
  } catch (error) {
    return { rules: [], errors: [`Could not read ${fileName}: ${error.message}`] };
  }

  if (!Array.isArray(rawRules) || rawRules.length === 0) {
    return { rules: [], errors: [`${fileName} contains no rules.`] };
  }

  const rules = [];
  const errors = [];
  rawRules.forEach((raw, index) => {
    const label = raw?.id ? `Rule ${raw.id}` : `Rule #${index + 1}`;
    if (!raw?.id || !raw?.name) {
      errors.push(`${label}: "id" and "name" are required.`);
    } else if (!MEASURE_IDS.has(raw.measure)) {
      errors.push(`${label}: unknown measure "${raw.measure}".`);
    } else if (typeof raw.threshold !== 'number' || raw.threshold < 0 || raw.threshold > 100) {
      errors.push(`${label}: "threshold" must be a number from 0 to 100.`);
    } else {
      rules.push({
        id: String(raw.id),
        name: String(raw.name),
        measure: raw.measure,
        threshold: raw.threshold,
        blocking: raw.blocking === true,
        source: fileName
      });
    }
  });
  return { rules, errors };
}
