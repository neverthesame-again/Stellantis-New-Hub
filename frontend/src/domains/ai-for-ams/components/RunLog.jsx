import React, { useEffect, useRef } from 'react';
import { getVisibleLogs } from '../model/runModel';

const TIME_FORMAT = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

/**
 * Timestamp of a log line: run start plus the line's offset, with milliseconds.
 *
 * @param {string} startedAt ISO timestamp.
 * @param {number} offsetMs
 * @returns {string} e.g. "14:05:31.240".
 */
function lineTime(startedAt, offsetMs) {
  const date = new Date(new Date(startedAt).getTime() + offsetMs);
  return `${TIME_FORMAT.format(date)}.${String(date.getMilliseconds()).padStart(3, '0')}`;
}

/**
 * Live log panel with timestamped INFO / WARN / ERROR lines. Follows new
 * lines while the run is playing.
 *
 * @param {Object} props
 * @param {import('../model/runModel').AmsRun} props.run
 * @param {number | null} props.revealedCount Steps revealed while the run animates; null otherwise.
 * @returns {JSX.Element}
 */
export default function RunLog({ run, revealedCount }) {
  const lines = getVisibleLogs(run, revealedCount);
  const panelRef = useRef(null);

  // Follow new lines inside the panel only; never scroll the page itself.
  useEffect(() => {
    if (revealedCount !== null && panelRef.current) panelRef.current.scrollTop = panelRef.current.scrollHeight;
  }, [lines.length, revealedCount]);

  return (
    <div ref={panelRef} className="ams-console ams-run-log" role="log" aria-live="polite" aria-label="Run log">
      {lines.length === 0 && <p className="ams-console-idle">Waiting for the first step…</p>}
      {lines.map((line) => (
        <div key={line.id} className={`ams-log-line is-${line.level.toLowerCase()}`}>
          <span className="ams-console-time">{lineTime(run.startedAt, line.offsetMs)}</span>
          <span className="ams-log-level">{line.level}</span>
          <span>{line.message}</span>
        </div>
      ))}
    </div>
  );
}
