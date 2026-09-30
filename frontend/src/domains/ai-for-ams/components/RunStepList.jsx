import React from 'react';
import { Ban, CircleCheck, CircleDashed, CircleX, Hourglass, Loader2, TriangleAlert } from 'lucide-react';
import { STEP_STATUS, getStepStatus } from '../model/runModel';

const STATUS_ICON = {
  [STEP_STATUS.PENDING]: { icon: CircleDashed, label: 'Pending' },
  [STEP_STATUS.RUNNING]: { icon: Loader2, label: 'Running', spin: true },
  [STEP_STATUS.PASSED]: { icon: CircleCheck, label: 'Passed' },
  [STEP_STATUS.WARNING]: { icon: TriangleAlert, label: 'Passed with warnings' },
  [STEP_STATUS.FAILED]: { icon: CircleX, label: 'Failed' },
  [STEP_STATUS.WAITING]: { icon: Hourglass, label: 'Waiting for approval' },
  [STEP_STATUS.REJECTED]: { icon: CircleX, label: 'Rejected' },
  [STEP_STATUS.SKIPPED]: { icon: Ban, label: 'Skipped' }
};

/**
 * Formats a step duration, e.g. "1.2 s".
 *
 * @param {number} ms
 * @returns {string}
 */
const formatDuration = (ms) => `${(ms / 1000).toFixed(1)} s`;

/**
 * Ordered list of a run's pipeline steps with live status, duration and result
 * line; steps generated without a connected runtime are marked "Simulated".
 *
 * @param {Object} props
 * @param {import('../model/runModel').AmsRun} props.run
 * @param {number | null} props.revealedCount Steps revealed while the run animates; null otherwise.
 * @returns {JSX.Element}
 */
export default function RunStepList({ run, revealedCount }) {
  return (
    <ol className="ams-run-steps">
      {run.steps.map((step, index) => {
        const status = getStepStatus(run, index, revealedCount);
        const { icon: Icon, label, spin } = STATUS_ICON[status];
        const showResult = status !== STEP_STATUS.PENDING && status !== STEP_STATUS.RUNNING && status !== STEP_STATUS.SKIPPED;
        return (
          <li key={step.id} className={`ams-run-step is-${status}`}>
            <Icon size={16} className={spin ? 'ams-spin' : undefined} aria-label={label} />
            <div className="ams-run-step-body">
              <div className="ams-run-step-head">
                <span className="ams-run-step-label">{index + 1}. {step.label}</span>
                {showResult && <span className="ams-muted-note">{formatDuration(step.durationMs)}</span>}
                {step.simulated && showResult && <span className="st-badge badge-purple">Simulated</span>}
              </div>
              {showResult && <p className="ams-run-step-detail">{step.detail}</p>}
              {status === STEP_STATUS.SKIPPED && <p className="ams-run-step-detail">Skipped</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
