import React from 'react';
import { Trophy, CheckCircle2, XCircle, Rocket, CircleDashed } from 'lucide-react';
import { scoreTone } from './evalUtils';

/**
 * Leaderboard — agents sorted by score (not-evaluated at the bottom).
 * `rows`: [{ agent, summary, rank }]
 */
export default function Leaderboard({ rows, totalCount, selectedId, onSelect, threshold, runningId }) {
  return (
    <aside className="ad-studio-card ad-eval-lb">
      <div className="ad-studio-card-title">
        <h3><Trophy size={13} /> Leaderboard</h3>
        <span className="ad-studio-badge is-mono">{rows.length}/{totalCount}</span>
      </div>
      <div className="ad-eval-lb-legend" aria-label="Score colour legend">
        <span><i className="is-good" /> ≥ {threshold}</span>
        <span><i className="is-warn" /> {threshold - 5}–{threshold - 1}</span>
        <span><i className="is-bad" /> &lt; {threshold - 5}</span>
      </div>

      {rows.length === 0 ? (
        <div className="ad-studio-empty">No agents match the current filters.</div>
      ) : (
        <div className="ad-studio-scroll ad-eval-lb-list">
          {rows.map(({ agent, summary, rank }) => {
            const tone = scoreTone(summary.score, threshold);
            const ready = agent.stage === 5 && !summary.pass;
            return (
              <button
                key={agent.id}
                type="button"
                className={`ad-eval-lb-row ${selectedId === agent.id ? 'is-active' : ''} ${summary.evaluated ? '' : 'is-pending'}`}
                onClick={() => onSelect(agent.id)}
                aria-pressed={selectedId === agent.id}
              >
                <span className={`ad-eval-lb-rank ${rank && rank <= 3 ? `is-top is-top-${rank}` : ''}`}>{rank ?? '—'}</span>
                <span className="ad-eval-lb-body">
                  <span className="ad-eval-lb-name" title={agent.name}>{agent.name}</span>
                  <span className="ad-eval-lb-meta">{agent.subDomain}</span>
                  <span className="ad-eval-lb-tags">
                    <span className={`ad-studio-badge ad-studio-asil asil-${agent.asil}`}>ASIL {agent.asil}</span>
                    {summary.evaluated ? (
                      summary.pass ? (
                        <span className="ad-studio-badge is-success"><CheckCircle2 size={10} /> Pass</span>
                      ) : (
                        <span className="ad-studio-badge is-critical"><XCircle size={10} /> Fail</span>
                      )
                    ) : (
                      <span className="ad-studio-badge"><CircleDashed size={10} /> Not evaluated</span>
                    )}
                    {ready && <span className="ad-studio-badge is-info" title="Workflow Mapped (stage 5) — ready for the evaluation gate"><Rocket size={10} /> Ready</span>}
                    {runningId === agent.id && <span className="ad-studio-badge is-purple">Evaluating…</span>}
                  </span>
                  {summary.evaluated && (
                    <span className="ad-eval-lb-bar"><span className={`is-${tone}`} style={{ width: `${summary.score}%` }} /></span>
                  )}
                </span>
                <span className={`ad-eval-lb-score is-${tone}`}>
                  {summary.evaluated ? summary.score : '—'}
                  {summary.evaluated && <small>/100</small>}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </aside>
  );
}
