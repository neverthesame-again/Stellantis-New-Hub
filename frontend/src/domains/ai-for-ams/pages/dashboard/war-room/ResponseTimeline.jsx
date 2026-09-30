import React from 'react';
import { Bot, UserRound } from 'lucide-react';
import { formatTime } from '../../../utils/formatters';

/**
 * Agent collaboration timeline (F4): time, what happened and who did it —
 * agents and people — newest first. New entries fade in as work progresses.
 *
 * @param {Object} props
 * @param {Array<{ id: string, at: string, actor: string, kind: 'agent' | 'human', text: string }>} props.entries
 * @returns {JSX.Element}
 */
export default function ResponseTimeline({ entries }) {
  return (
    <ol className="ams-timeline" aria-label="Agent collaboration timeline">
      {entries.map((entry) => (
        <li key={entry.id} className={`ams-timeline-entry is-${entry.kind}`}>
          <time className="ams-timeline-time" dateTime={entry.at}>{formatTime(entry.at)}</time>
          <span className="ams-timeline-dot" aria-hidden="true">
            {entry.kind === 'agent' ? <Bot size={13} /> : <UserRound size={13} />}
          </span>
          <div className="ams-timeline-body">
            <p className="ams-timeline-actor">{entry.actor}</p>
            <p className="ams-timeline-text">{entry.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
