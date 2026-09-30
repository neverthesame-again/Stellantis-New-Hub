/**
 * @file Identifier helpers.
 */

/**
 * Creates a unique, opaque id such as "EVT-lx3k9a-4f2c" for internal records
 * (events, audit entries) that users never need to read or type.
 *
 * @param {string} prefix Short uppercase prefix describing the record type.
 * @returns {string} A unique id.
 */
export function createId(prefix) {
  const random = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now().toString(36)}-${random}`;
}

/**
 * Next human-readable sequential id, e.g. "WF-INB-202" after "WF-INB-201".
 * Pure: derived only from the ids that already exist.
 *
 * @param {string[]} existingIds Ids already in use (ids with other formats are ignored).
 * @param {string} prefix        e.g. "WF-INB".
 * @param {number} floor         Number to count up from when no matching id exists.
 * @returns {string}
 */
export function nextSequentialId(existingIds, prefix, floor) {
  const pattern = new RegExp(`^${prefix}-(\\d+)$`);
  const highest = existingIds.reduce((max, id) => {
    const match = pattern.exec(id);
    return match ? Math.max(max, Number(match[1])) : max;
  }, floor);
  return `${prefix}-${highest + 1}`;
}
