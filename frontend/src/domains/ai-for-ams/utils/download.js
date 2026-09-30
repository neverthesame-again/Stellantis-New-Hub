/**
 * @file Browser file download helper.
 */

/**
 * Offers text content to the user as a file download.
 *
 * @param {string} fileName  Suggested file name.
 * @param {string} text      File contents.
 * @param {string} [mimeType]
 */
export function downloadTextFile(fileName, text, mimeType = 'application/json') {
  const url = URL.createObjectURL(new Blob([text], { type: mimeType }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/**
 * Turns a display name into a safe file name stem, e.g. "Change risk review" → "change-risk-review".
 *
 * @param {string} name
 * @returns {string}
 */
export function toFileStem(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'workflow';
}
