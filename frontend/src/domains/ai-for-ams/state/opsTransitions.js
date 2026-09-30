/**
 * @file Pure state transitions for programmes and the runtime monitor (F12)
 * and FinOps prompt rules (F10).
 */

import { PROMPT_RULE_MODES, PROMPT_RULE_SCOPES } from '../model/finopsModel';
import { nextSequentialId } from '../utils/ids';
import { appendAudit, auditEntry } from './auditLog';

/**
 * @typedef {import('./seedState').AmsStudioState} AmsStudioState
 * @typedef {import('./auditLog').EventMeta} EventMeta
 */

/**
 * Id the next programme will get, e.g. "PRG-3".
 *
 * @param {AmsStudioState} state
 * @returns {string}
 */
export function nextProgrammeId(state) {
  return nextSequentialId(state.programmes.map((programme) => programme.id), 'PRG', 0);
}

/**
 * Creates a programme from the setup wizard; it becomes the active programme.
 *
 * @param {AmsStudioState} state
 * @param {{ programmeId: string, programme: Object, meta: EventMeta }} payload
 * @returns {AmsStudioState}
 */
export function createProgramme(state, { programmeId, programme, meta }) {
  if (!programme.name?.trim() || !programme.description?.trim()) return state;
  const created = { ...programme, id: programmeId, name: programme.name.trim(), createdAt: meta.at };
  return appendAudit(
    { ...state, programmes: [...state.programmes, created], activeProgrammeId: programmeId },
    auditEntry(meta, 'prg', { action: 'Programme created', target: created.name, detail: `${created.agentIds.length} agents linked` })
  );
}

/**
 * Switches the active programme (null shows everything).
 *
 * @param {AmsStudioState} state
 * @param {{ programmeId: string | null, meta: EventMeta }} payload
 * @returns {AmsStudioState}
 */
export function activateProgramme(state, { programmeId, meta }) {
  if (programmeId !== null && !state.programmes.some((programme) => programme.id === programmeId)) return state;
  if (state.activeProgrammeId === programmeId) return state;
  const name = state.programmes.find((programme) => programme.id === programmeId)?.name ?? 'All programmes';
  return appendAudit({ ...state, activeProgrammeId: programmeId }, auditEntry(meta, 'prg-active', {
    action: 'Active programme changed', target: name
  }));
}

/**
 * Pauses a running published agent, or resumes a paused one (mocked runtime control).
 *
 * @param {AmsStudioState} state
 * @param {{ agentId: string, meta: EventMeta }} payload
 * @returns {AmsStudioState}
 */
export function toggleAgentRuntime(state, { agentId, meta }) {
  const agent = state.studioAgents.find((candidate) => candidate.id === agentId);
  if (!agent?.publishedAt) return state;
  const paused = state.pausedAgentIds.includes(agentId);
  return appendAudit({
    ...state,
    pausedAgentIds: paused ? state.pausedAgentIds.filter((id) => id !== agentId) : [...state.pausedAgentIds, agentId]
  }, auditEntry(meta, 'rt', { action: paused ? 'Agent resumed' : 'Agent paused', target: agent.name }));
}

/**
 * Adds a prompt rule, or updates one with the same id.
 *
 * @param {AmsStudioState} state
 * @param {{ rule: { id?: string, name: string, scope: string, mode: string, parameters: string }, meta: EventMeta }} payload
 * @returns {AmsStudioState}
 */
export function savePromptRule(state, { rule, meta }) {
  if (!rule.name?.trim() || !PROMPT_RULE_SCOPES.includes(rule.scope) || !PROMPT_RULE_MODES.includes(rule.mode)) return state;
  const exists = rule.id && state.promptRules.some((candidate) => candidate.id === rule.id);
  const saved = { ...rule, name: rule.name.trim(), id: exists ? rule.id : nextSequentialId(state.promptRules.map((candidate) => candidate.id), 'PR', 0) };
  const promptRules = exists
    ? state.promptRules.map((candidate) => (candidate.id === saved.id ? saved : candidate))
    : [...state.promptRules, saved];
  return appendAudit({ ...state, promptRules }, auditEntry(meta, 'pr', {
    action: exists ? 'Prompt rule updated' : 'Prompt rule added',
    target: saved.name,
    detail: `${saved.scope} · ${saved.mode}`
  }));
}
