/**
 * @file Display formatters shared by AMS pages.
 */

const DATE_TIME_FORMAT = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit'
});

const TIME_FORMAT = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' });

/**
 * Formats a timestamp for audit and decision-history lines, e.g. "30 Sep, 14:05".
 *
 * @param {Date | string | number} value A Date, ISO string or epoch milliseconds.
 * @returns {string} The formatted date and time, or an empty string for invalid input.
 */
export function formatDateTime(value) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? '' : DATE_TIME_FORMAT.format(date);
}

const DATE_FORMAT = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

/**
 * Formats a calendar date, e.g. "15 Dec 2026".
 *
 * @param {Date | string | number} value
 * @returns {string} The formatted date, or an empty string for invalid input.
 */
export function formatDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? '' : DATE_FORMAT.format(date);
}

/**
 * Formats an elapsed duration, e.g. "38 min 12 s" or "2 h 05 min".
 *
 * @param {number} ms Duration in milliseconds (negative values count as 0).
 * @returns {string}
 */
export function formatElapsed(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours} h ${String(minutes).padStart(2, '0')} min`;
  return `${minutes} min ${String(seconds).padStart(2, '0')} s`;
}

/**
 * Formats a time of day, e.g. "14:05".
 *
 * @param {Date | string | number} value
 * @returns {string}
 */
export function formatTime(value) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? '' : TIME_FORMAT.format(date);
}

/**
 * Pluralises a simple English noun.
 *
 * @param {number} count Quantity.
 * @param {string} singular Singular form, e.g. "item".
 * @param {string} [plural] Plural form; defaults to singular + "s".
 * @returns {string} e.g. "1 item", "3 items".
 */
export function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}
