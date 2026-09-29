import React, { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';
import { formatClock } from './harnessUtils';

/** Monospace live log console — dark in both themes, auto-scrolls to the newest line. */
export default function RunConsole({ log = [], runId, running = false, maxHeight = 320 }) {
  const bodyRef = useRef(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log.length]);

  const counts = log.reduce((acc, l) => ({ ...acc, [l.level]: (acc[l.level] || 0) + 1 }), {});

  return (
    <div className="ad-hrn-console">
      <div className="ad-hrn-console-bar">
        <span className="ad-hrn-console-dots" aria-hidden="true"><i /><i /><i /></span>
        <Terminal size={13} />
        <span className="ad-hrn-console-title">harness.log{runId ? ` — ${runId}` : ''}</span>
        <span className="ad-hrn-console-counts">
          <span className="lv-info">{counts.INFO || 0} info</span>
          <span className="lv-warn">{counts.WARN || 0} warn</span>
          <span className="lv-error">{counts.ERROR || 0} error</span>
        </span>
      </div>
      <div className="ad-hrn-console-body" ref={bodyRef} style={{ maxHeight }}>
        {log.length === 0 && <div className="ad-hrn-console-empty">$ awaiting harness execution…</div>}
        {log.map((l, i) => (
          <div key={`${l.t}-${i}`} className={`ad-hrn-console-line lv-${String(l.level).toLowerCase()}`}>
            <span className="ad-hrn-console-ts">{formatClock(l.t)}</span>
            <span className="ad-hrn-console-lv">{l.level.padEnd(5, ' ')}</span>
            <span className="ad-hrn-console-msg">{l.msg}</span>
          </div>
        ))}
        {running && <div className="ad-hrn-console-cursor">▍</div>}
      </div>
    </div>
  );
}
