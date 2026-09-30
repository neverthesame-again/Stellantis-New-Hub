/**
 * @file Audit-trail helpers shared by the store transitions.
 */

/** Upper bound on retained audit entries, to keep saved state small. */
const MAX_AUDIT_ENTRIES = 500;

/**
 * @typedef {Object} EventMeta
 * @property {string} eventId Unique id of the user action; derived record ids use it as a prefix.
 * @property {string} actor   Who acted.
 * @property {string} at      ISO timestamp.
 */

/**
 * Prepends audit entries (newest first) and trims the log.
 *
 * @param {import('./seedState').AmsStudioState} state
 * @param {...import('./seedState').AmsAuditEntry} entries Entries in the order they happened.
 * @returns {import('./seedState').AmsStudioState}
 */
export function appendAudit(state, ...entries) {
  return { ...state, auditLog: [...entries.reverse(), ...state.auditLog].slice(0, MAX_AUDIT_ENTRIES) };
}

/**
 * Builds an audit entry from an event.
 *
 * @param {EventMeta} meta
 * @param {string} suffix Distinguishes several entries written by one event.
 * @param {{ action: string, target: string, detail?: string, from?: string, to?: string }} fields
 * @returns {import('./seedState').AmsAuditEntry}
 */
export function auditEntry(meta, suffix, fields) {
  return { id: `${meta.eventId}-${suffix}`, at: meta.at, actor: meta.actor, ...fields };
}
