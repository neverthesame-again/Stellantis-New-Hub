/**
 * @file Initial (demo) state of the AMS studio store.
 *
 * Only data the user can change lives in the store. Read-only reference data —
 * the tools catalogue, dashboard KPIs — keeps being read straight from
 * `mockData.js`.
 */

import { amsExperienceData, amsWorkflowInbox } from '../mockData.js';
import { DEFAULT_EVALUATION_RULES, DEFAULT_PASS_MARK } from '../model/evaluationModel';
import {
  SEED_APPROVAL_INBOX_ITEMS,
  SEED_SKILLS,
  SEED_STUDIO_AGENTS,
  SEED_WORKFLOWS,
  buildSeedAuditLog
} from './seed/studioSeed';
import { buildSeedIncidentResponses } from './seed/incidentSeed';
import { SEED_PROGRAMMES, SEED_PROMPT_RULES } from './seed/opsSeed';

/**
 * Version of the persisted state shape. Increase it whenever the shape changes
 * incompatibly; older saved state is then replaced by fresh demo data.
 *
 * - v1: models, subscriptions, catalogue agents, inbox, audit log.
 * - v2: adds studio agents, skills, workflows, evaluation rules and settings.
 * - v3: workflows carry their node graph; adds harness and workflow runs.
 * - v4: adds live incident responses (war room and RCA hand-off).
 * - v5: adds programmes, the active programme, paused agents and prompt rules.
 * - v6: changes brownfield pipeline initiation requests to application enhancement requests.
 */
export const AMS_STUDIO_SCHEMA_VERSION = 6;

/**
 * @typedef {Object} AmsAuditEntry
 * @property {string} id        Unique entry id.
 * @property {string} at        ISO-8601 timestamp.
 * @property {string} actor     Who acted, e.g. "Tony / Head of AMS".
 * @property {string} action    What happened, e.g. "Approved".
 * @property {string} target    What it happened to, e.g. "WF-INB-101" or an agent name.
 * @property {string} [detail]  Free-text context (decision notes, stage change…).
 * @property {string} [from]    Previous lifecycle stage, for stage changes.
 * @property {string} [to]      New lifecycle stage, for stage changes.
 */

/**
 * @typedef {Object} AmsStudioState
 * @property {number} schemaVersion           Always {@link AMS_STUDIO_SCHEMA_VERSION}.
 * @property {Array<Object>} models           Model catalogue with per-user `subscribed` flags.
 * @property {Array<Object>} subscriptions    The user's active entitlements.
 * @property {Array<Object>} agents           Legacy published agent catalogue (pre-studio agents).
 * @property {Array<Object>} studioAgents     Agents registered through Agent Studio, with lifecycle state.
 * @property {Array<Object>} skills           Certified skill library.
 * @property {Array<Object>} workflows        Incident workflows (node graphs) agents can be mapped to.
 * @property {Array<import('../model/runModel').AmsRun>} runs Harness and workflow runs, newest first.
 * @property {Record<string, Object>} incidentResponses Live response per open incident (see incidentTransitions.js).
 * @property {Array<Object>} programmes       Programmes grouping agents by service portfolio.
 * @property {string | null} activeProgrammeId Programme filtering the studio; null for all.
 * @property {string[]} pausedAgentIds        Published agents paused in the runtime monitor.
 * @property {Array<Object>} promptRules      FinOps prompt rules.
 * @property {Array<Object>} evaluationRules  Active evaluation rules (platform + uploaded packs).
 * @property {{ passMark: number }} settings  Platform settings.
 * @property {Array<Object>} inbox            Workflow Inbox items and their decision history.
 * @property {Array<AmsAuditEntry>} auditLog  Newest-first audit trail.
 */

/**
 * Creates a fresh copy of the demo state. A deep copy guarantees that store
 * updates never mutate the shared seed modules. Incident timings are relative
 * to `now`, so live timers start from realistic values.
 *
 * @param {number} [now] Epoch milliseconds; defaults to the current time.
 * @returns {AmsStudioState}
 */
export function createSeedState(now = Date.now()) {
  return structuredClone({
    incidentResponses: buildSeedIncidentResponses(SEED_STUDIO_AGENTS, now),
    programmes: SEED_PROGRAMMES,
    activeProgrammeId: null,
    pausedAgentIds: [],
    promptRules: SEED_PROMPT_RULES,
    schemaVersion: AMS_STUDIO_SCHEMA_VERSION,
    models: amsExperienceData.models,
    subscriptions: amsExperienceData.mySubscriptions,
    agents: amsExperienceData.agents,
    studioAgents: SEED_STUDIO_AGENTS,
    skills: SEED_SKILLS,
    workflows: SEED_WORKFLOWS,
    runs: [],
    evaluationRules: DEFAULT_EVALUATION_RULES,
    settings: { passMark: DEFAULT_PASS_MARK },
    inbox: [...SEED_APPROVAL_INBOX_ITEMS, ...amsWorkflowInbox],
    auditLog: buildSeedAuditLog()
  });
}
