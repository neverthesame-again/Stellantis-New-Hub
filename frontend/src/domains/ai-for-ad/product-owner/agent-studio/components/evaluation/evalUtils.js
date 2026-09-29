/**
 * Evaluation Center (F5) — pure helpers shared by the evaluation sub-components.
 * No React here; all state comes from AgentStudioContext.
 */
import {
  EVAL_DIMENSIONS,
  ASIL_LEVELS,
  AD_SUBDOMAINS,
  applyRules,
  isEvaluationPassing,
  getStage
} from '../../agentStudioData';

export const DIM_KEYS = EVAL_DIMENSIONS.map((d) => d.key);
export const THRESHOLD_MIN = 70;
export const THRESHOLD_MAX = 95;

export const getDimension = (key) => EVAL_DIMENSIONS.find((d) => d.key === key);
export const dimensionLabel = (key) => (key === 'overall' ? 'Overall score' : getDimension(key)?.label || key);

export const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

/** ≥ threshold → good · within 5 below → warn · else bad. */
export function scoreTone(score, threshold) {
  if (score === null || score === undefined) return 'none';
  if (score >= threshold) return 'good';
  if (score >= threshold - 5) return 'warn';
  return 'bad';
}

export const ruleApplies = (rule, agent) =>
  (!rule.asil || rule.asil.includes(agent.asil)) && (!rule.subDomain || rule.subDomain.includes(agent.subDomain));

/** Enabled rules that apply to this agent (independent of whether it was evaluated). */
export const applicableRules = (agent, rules) => rules.filter((r) => r.enabled && ruleApplies(r, agent));

export const ruleMin = (rule, threshold) => (rule.dimension === 'overall' ? threshold : rule.min);

/** Live evaluation summary — recomputed whenever rules or the threshold change. */
export function summarizeAgent(agent, rules, threshold) {
  const ev = agent.evaluation;
  if (!ev) return { evaluated: false, pass: null, score: null, outcomes: [], blocking: [], advisory: [] };
  const outcomes = applyRules(agent, ev, rules, threshold);
  return {
    evaluated: true,
    pass: isEvaluationPassing(agent, ev, rules, threshold),
    score: ev.score,
    outcomes,
    blocking: outcomes.filter((o) => !o.pass && o.rule.blocking),
    advisory: outcomes.filter((o) => !o.pass && !o.rule.blocking)
  };
}

/** Highest applicable rule minimum per dimension → { [dimKey]: { min, rules: [names] } }. */
export function dimensionMinimums(agent, rules) {
  const out = {};
  applicableRules(agent, rules)
    .filter((r) => r.dimension !== 'overall' && typeof r.min === 'number')
    .forEach((r) => {
      const cur = out[r.dimension];
      if (!cur) out[r.dimension] = { min: r.min, rules: [r.name], blocking: r.blocking };
      else {
        cur.rules.push(r.name);
        if (r.min > cur.min) { cur.min = r.min; cur.blocking = r.blocking; }
      }
    });
  return out;
}

/** Platform aggregate per dimension across evaluated agents. */
export function aggregateDimensions(agents) {
  const evaluated = agents.filter((a) => a.evaluation);
  return EVAL_DIMENSIONS.map((d) => {
    const values = evaluated.map((a) => a.evaluation.dims[d.key]).filter((v) => typeof v === 'number');
    const n = values.length;
    return {
      ...d,
      n,
      avg: n ? Math.round((values.reduce((s, v) => s + v, 0) / n) * 10) / 10 : null,
      min: n ? Math.min(...values) : null,
      max: n ? Math.max(...values) : null
    };
  });
}

/** What passing / failing will do for the agent's current lifecycle stage. */
export function lifecycleNote(agent) {
  const s = agent.stage;
  const label = getStage(s).label;
  if (s <= 3) {
    return {
      tone: 'info',
      title: 'Diagnostic run',
      text: `${label} (stage ${s}). An evaluation now is diagnostic only — pass or fail, the lifecycle does not move until tools and a workflow are connected in the Onboarding Studio.`
    };
  }
  if (s === 4) {
    return {
      tone: 'warn',
      title: 'Failing regresses the agent',
      text: 'Tools Connected (stage 4). A pass is recorded, but the agent still needs a workflow mapping before it reaches the evaluation gate. A fail moves it back to Skills & Knowledge (stage 3).'
    };
  }
  if (s === 5) {
    return {
      tone: 'accent',
      title: 'Evaluation gate → governance',
      text: `Workflow Mapped (stage 5) — this run is the gate. Passing moves the agent to Evaluated and routes it to ${agent.approver || 'an approver (none assigned yet)'} in the Governance Center. Failing moves it back to Skills & Knowledge (stage 3).`,
      exit: getStage(6).exit
    };
  }
  if (s === 6) {
    const gov = agent.governance?.status === 'pending' ? 'awaiting a governance decision' : `governance status "${agent.governance?.status || 'n/a'}"`;
    return {
      tone: 'warn',
      title: 'Re-evaluating a governance candidate',
      text: `Evaluated (stage 6), ${gov}. Passing keeps it in the governance queue; failing withdraws the submission and moves it back to Skills & Knowledge (stage 3).`
    };
  }
  return {
    tone: 'neutral',
    title: 'Monitoring run',
    text: `${label} (stage ${s}). The lifecycle stage is kept — the score is recorded for continuous monitoring${agent.operationalState === 'Suspended' ? ' and supports the re-evaluation requested for this suspended agent' : ''}.`
  };
}

export const parseAuditScore = (detail = '') => {
  const m = /Score (\d+)/.exec(detail);
  return m ? Number(m[1]) : null;
};

export function relativeTime(iso) {
  if (!iso) return '—';
  const diff = Date.now() - Date.parse(iso);
  if (Number.isNaN(diff)) return '—';
  const min = Math.round(diff / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min} min ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  return `${d} d ago`;
}

// ---------------------------------------------------------------------------
// Rule packs
// ---------------------------------------------------------------------------
export const SAMPLE_RULE_PACK = [
  {
    name: 'SOTIF Scenario Coverage Gate',
    dimension: 'scenarioCoverage',
    min: 85,
    blocking: true,
    subDomain: ['Perception', 'Planning & Control'],
    description: 'ISO 21448 triggering-condition scenarios exercised for perception and planning agents.'
  },
  {
    name: 'ASIL D Requirement Accuracy',
    dimension: 'reqAccuracy',
    min: 92,
    blocking: true,
    asil: ['D'],
    description: 'ASIL D agents must match linked requirement intent in ≥ 92 % of artefacts.'
  },
  {
    name: 'HIL Bench Latency Advisory',
    dimension: 'latency',
    min: 80,
    blocking: false,
    subDomain: ['Validation & HIL'],
    description: 'Advisory: HIL agents should answer inside the dSPACE bench cycle budget.'
  }
];

const toList = (v) => (v === undefined || v === null ? undefined : Array.isArray(v) ? v : [v]);

/**
 * Validates a parsed rule pack. Accepts an array or `{ rules: [...] }`.
 * Returns { error } for a structural problem, else { valid, entries }.
 */
export function validateRulePack(data, existingRules) {
  const list = Array.isArray(data) ? data : data && Array.isArray(data.rules) ? data.rules : null;
  if (!list) return { error: 'A rule pack must be a JSON array of rule objects (or an object with a "rules" array).' };
  if (!list.length) return { error: 'The rule pack is empty.' };

  const names = new Set(existingRules.map((r) => String(r.name).trim().toLowerCase()));
  const valid = [];
  const entries = [];

  list.forEach((raw, index) => {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      entries.push({ index, name: `Entry ${index + 1}`, ok: false, errors: ['Entry is not a JSON object'] });
      return;
    }
    const errors = [];
    const name = typeof raw.name === 'string' ? raw.name.trim() : '';
    if (!name) errors.push('"name" is required');
    else if (names.has(name.toLowerCase())) errors.push(`a rule named "${name}" already exists`);

    if (!DIM_KEYS.includes(raw.dimension)) {
      errors.push(`"dimension" must be one of ${DIM_KEYS.join(', ')}${raw.dimension !== undefined ? ` (got "${raw.dimension}")` : ''}`);
    }

    const min = typeof raw.min === 'string' && raw.min.trim() !== '' ? Number(raw.min) : raw.min;
    if (typeof min !== 'number' || !Number.isFinite(min) || min < 0 || min > 100) errors.push('"min" must be a number between 0 and 100');

    if (raw.blocking !== undefined && typeof raw.blocking !== 'boolean') errors.push('"blocking" must be true or false');

    const asil = toList(raw.asil);
    if (asil && (!asil.length || asil.some((a) => !ASIL_LEVELS.includes(a)))) errors.push(`"asil" values must be from ${ASIL_LEVELS.join(', ')}`);

    const subDomain = toList(raw.subDomain);
    if (subDomain && (!subDomain.length || subDomain.some((s) => !AD_SUBDOMAINS.includes(s)))) {
      errors.push(`"subDomain" values must be from ${AD_SUBDOMAINS.join(', ')}`);
    }

    if (raw.description !== undefined && typeof raw.description !== 'string') errors.push('"description" must be a string');

    const ok = errors.length === 0;
    entries.push({ index, name: name || `Entry ${index + 1}`, ok, errors });
    if (!ok) return;

    names.add(name.toLowerCase());
    valid.push({
      name,
      dimension: raw.dimension,
      min,
      blocking: raw.blocking ?? false,
      ...(asil ? { asil } : {}),
      ...(subDomain ? { subDomain } : {}),
      description: (raw.description || '').trim() || `${getDimension(raw.dimension).label} must be ≥ ${min}.`
    });
  });

  return { valid, entries };
}
