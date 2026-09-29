import React from 'react';
import { Circle, CircleCheck, CircleX, CircleDashed, Hand, LoaderCircle } from 'lucide-react';
import { HARNESS_STEPS } from '../../agentStudioData';
import { formatDuration } from './harnessUtils';

const STATUS_ICON = {
  pending: Circle,
  running: LoaderCircle,
  passed: CircleCheck,
  failed: CircleX,
  skipped: CircleDashed,
  waiting: Hand
};

const STATUS_LABEL = {
  pending: 'Pending',
  running: 'Running',
  passed: 'Passed',
  failed: 'Failed',
  skipped: 'Skipped',
  waiting: 'Waiting'
};

/**
 * Vertical 10-step harness pipeline. `steps` are run steps ({key,status,ms,detail});
 * when omitted the pipeline renders as a pending preview.
 */
export default function PipelineTimeline({ steps, compact = false }) {
  const byKey = Object.fromEntries((steps || []).map((s) => [s.key, s]));
  const rows = HARNESS_STEPS.map((def, i) => {
    const s = byKey[def.key] || { status: 'pending', ms: 0, detail: def.description };
    return { def, s, i };
  });
  const done = rows.filter((r) => ['passed', 'failed', 'skipped', 'waiting'].includes(r.s.status)).length;
  const total = rows.reduce((sum, r) => sum + (r.s.ms || 0), 0);
  const failed = rows.some((r) => r.s.status === 'failed');
  const waiting = rows.some((r) => r.s.status === 'waiting');
  const pct = Math.round((done / HARNESS_STEPS.length) * 100);

  return (
    <div className={`ad-hrn-pipeline ${compact ? 'is-compact' : ''}`}>
      <div className="ad-hrn-pipeline-summary">
        <span>
          <strong>{done}</strong>/{HARNESS_STEPS.length} steps · {formatDuration(total)}
        </span>
        <div className={`ad-studio-progress ${failed ? 'is-bad' : waiting ? 'is-warn' : done === HARNESS_STEPS.length ? 'is-good' : ''}`}>
          <span style={{ width: `${pct}%` }} />
        </div>
      </div>
      <ol className="ad-hrn-steps">
        {rows.map(({ def, s, i }) => {
          const Icon = STATUS_ICON[s.status] || Circle;
          return (
            <li key={def.key} className={`ad-hrn-step is-${s.status}`}>
              <span className="ad-hrn-step-icon">
                <Icon size={16} className={s.status === 'running' ? 'ad-hrn-spin' : ''} />
              </span>
              <div className="ad-hrn-step-body">
                <div className="ad-hrn-step-head">
                  <span className="ad-hrn-step-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="ad-hrn-step-label">{def.label}</span>
                  <span className={`ad-hrn-step-status is-${s.status}`}>{STATUS_LABEL[s.status] || s.status}</span>
                  {s.ms > 0 && <span className="ad-hrn-step-ms">{s.ms} ms</span>}
                </div>
                {!compact || s.status !== 'pending' ? (
                  <div className="ad-hrn-step-detail">{s.status === 'pending' ? def.description : s.detail}</div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
