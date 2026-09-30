import React from 'react';
import { Check } from 'lucide-react';
import {
  LIFECYCLE_STAGES,
  STAGE_COUNT,
  getCompletedStageCount,
  getCurrentStage,
  getProgressPercent
} from '../model/agentLifecycle';

/**
 * Nine-step horizontal lifecycle stepper (F2). Completed steps are ticked,
 * the current step is highlighted, and overall progress is shown as
 * completed stages ÷ 9.
 *
 * @param {Object} props
 * @param {Object} props.agent Studio agent.
 * @returns {JSX.Element}
 */
export default function LifecycleStepper({ agent }) {
  const current = getCurrentStage(agent);
  const completed = getCompletedStageCount(agent);
  const progress = getProgressPercent(agent);

  return (
    <div className="ams-stepper">
      <div className="ams-progress-label">
        <span>Stage {current.number} of {STAGE_COUNT} · <strong>{current.label}</strong></span>
        <span className="ams-text-accent">{progress}% complete</span>
      </div>
      <div
        className="ams-progress-track"
        role="progressbar"
        aria-label="Lifecycle progress"
        aria-valuemin={0}
        aria-valuemax={STAGE_COUNT}
        aria-valuenow={completed}
      >
        <div className="ams-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <ol className="ams-steps">
        {LIFECYCLE_STAGES.map((stage) => {
          const done = stage.number <= completed;
          const isCurrent = stage.number === current.number && !done;
          const state = done ? 'is-done' : isCurrent ? 'is-current' : 'is-upcoming';
          return (
            <li
              key={stage.id}
              className={`ams-step ${state}`}
              aria-current={isCurrent ? 'step' : undefined}
              title={stage.description}
            >
              <span className="ams-step-dot" aria-hidden="true">
                {done ? <Check size={13} strokeWidth={3} /> : stage.number}
              </span>
              <span className="ams-step-label">{stage.label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
