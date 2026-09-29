import React from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { LIFECYCLE_STAGES } from '../agentStudioData';

/**
 * LifecycleStepper — the 9-stage AD agent lifecycle (F2).
 * `stage` is the last completed stage (1..9). The next stage is "current".
 * `compact` renders dots only (for list rows).
 */
export default function LifecycleStepper({ stage, compact = false }) {
  return (
    <div className={`ad-studio-stepper ${compact ? 'is-compact' : ''}`} aria-label={`Lifecycle stage ${stage} of 9`}>
      {LIFECYCLE_STAGES.map((s, i) => {
        const done = s.id <= stage;
        const current = s.id === stage + 1;
        return (
          <React.Fragment key={s.key}>
            <span
              className={`ad-studio-step ${done ? 'is-done' : ''} ${current ? 'is-current' : ''}`}
              title={`${s.id}. ${s.label} — ${s.exit}`}
            >
              <span className="ad-studio-step-dot">{done ? <Check size={10} strokeWidth={3} /> : s.id}</span>
              <span className="ad-studio-step-label">{s.label}</span>
            </span>
            {i < LIFECYCLE_STAGES.length - 1 && <ChevronRight size={12} className="ad-studio-step-arrow" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
