/**
 * @file Browser persistence for the AMS studio store.
 *
 * All reads and writes of saved AMS state go through this module, so moving
 * to shared server storage later (for example Supabase) only touches this file.
 *
 * Guarantees:
 * - State is namespaced per signed-in user, so people sharing a browser do not
 *   see each other's agents.
 * - Saved state carries a schema version; a mismatch discards it and the store
 *   falls back to fresh demo data instead of rendering a broken shape.
 * - Storage failures (private mode, quota, blocked site data) never throw —
 *   the app keeps working, it just does not remember changes.
 */

const STORAGE_KEY_PREFIX = 'aihub_ams_studio';

/**
 * Builds the storage key for a user.
 *
 * @param {string | null | undefined} userId Stable user identifier (profile id or email).
 * @returns {string} A namespaced localStorage key.
 */
export function buildStorageKey(userId) {
  const owner = userId ? String(userId).trim().toLowerCase() : 'anonymous';
  return `${STORAGE_KEY_PREFIX}:${owner}`;
}

/**
 * Loads saved state when it exists and matches the expected schema version.
 *
 * @param {string} storageKey    Key from {@link buildStorageKey}.
 * @param {number} schemaVersion Version the current code understands.
 * @returns {Object | null} The saved state, or null when absent, unreadable or outdated.
 */
export function loadState(storageKey, schemaVersion) {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.schemaVersion !== schemaVersion) return null;
    return parsed;
  } catch (error) {
    console.warn('[AMS] Saved studio state could not be read; starting from demo data.', error);
    return null;
  }
}

/**
 * Saves state for the user.
 *
 * @param {string} storageKey Key from {@link buildStorageKey}.
 * @param {Object} state      Serialisable store state.
 * @returns {boolean} True when the state was written.
 */
export function saveState(storageKey, state) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
    return true;
  } catch (error) {
    console.warn('[AMS] Studio state could not be saved; changes will not survive a reload.', error);
    return false;
  }
}
