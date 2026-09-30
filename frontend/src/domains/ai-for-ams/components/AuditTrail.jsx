import React from 'react';
import { formatDateTime } from '../utils/formatters';
import EmptyState from './EmptyState';

/**
 * Newest-first feed of audit or lifecycle-history entries: timestamp, actor,
 * action, target and detail (with from → to for stage changes).
 *
 * @param {Object} props
 * @param {Array<{ id: string, at: string, actor: string, action: string, target?: string, detail?: string }>} props.entries
 * @param {boolean} [props.showTarget] Hide the target when every entry is about the same thing.
 * @param {string} [props.emptyMessage]
 * @returns {JSX.Element}
 */
export default function AuditTrail({ entries, showTarget = true, emptyMessage = 'No activity recorded yet.' }) {
  if (entries.length === 0) return <EmptyState message={emptyMessage} />;

  return (
    <ol className="ams-audit">
      {entries.map((entry) => (
        <li key={entry.id} className="ams-audit-entry">
          <time className="ams-audit-time" dateTime={entry.at}>{formatDateTime(entry.at)}</time>
          <div className="ams-audit-body">
            <p>
              <strong>{entry.action}</strong>
              {showTarget && entry.target && <> · <span className="ams-text-accent">{entry.target}</span></>}
            </p>
            {entry.detail && <p className="ams-audit-detail">{entry.detail}</p>}
            <p className="ams-audit-actor">{entry.actor}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
