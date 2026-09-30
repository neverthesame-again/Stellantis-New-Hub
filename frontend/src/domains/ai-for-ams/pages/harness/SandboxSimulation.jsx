import React from 'react';
import { CircleCheck, Play } from 'lucide-react';
import { SIMULATION_STATUS } from './useSandboxSimulation';

/** Environment facts shown above the console. */
const ENVIRONMENT = [
  { label: 'Target shadow cluster', value: 'k8s-shadow-twin-turin-01' },
  { label: 'Autonomous runbook', value: 'Kafka Partition Auto-Heal' },
  { label: 'Safety guardrails', value: 'GOV-901 pre-validated' },
  { label: 'Execution mode', value: 'Isolated digital-twin replica' }
];

const STATUS_LABEL = {
  [SIMULATION_STATUS.IDLE]: 'IDLE — READY',
  [SIMULATION_STATUS.RUNNING]: 'LIVE EXECUTION IN PROGRESS',
  [SIMULATION_STATUS.COMPLETED]: 'RUN COMPLETED'
};

/**
 * Simulated elapsed time for a console line, for display only.
 *
 * @param {number} index Zero-based step index.
 * @returns {string} e.g. "1.5s".
 */
const elapsedLabel = (index) => `${(index * 1.1 + 0.4).toFixed(1)}s`;

/**
 * Presentational sandbox simulation: environment facts, progress bar and a
 * live console. All run state comes from {@link useSandboxSimulation}.
 *
 * @param {Object} props
 * @param {ReturnType<import('./useSandboxSimulation').useSandboxSimulation>} props.simulation
 * @param {string | null} [props.triggeredBy] Agent that requested the run, if any.
 * @returns {JSX.Element}
 */
export default function SandboxSimulation({ simulation, triggeredBy }) {
  const { status, steps, totalSteps, outcome, run, clear } = simulation;
  const isRunning = status === SIMULATION_STATUS.RUNNING;
  const currentStep = Math.max(steps.length, 1);

  return (
    <section className="st-card ams-card" aria-labelledby="ams-sandbox-title">
      <div className="ams-page-header">
        <div>
          <div className="ams-badge-row">
            <span className="st-badge badge-purple">Simulated template</span>
            <span className="st-badge badge-success">Shadow cluster online</span>
          </div>
          <h3 id="ams-sandbox-title" className="ams-card-title">
            Kafka partition storm — autonomous remediation
          </h3>
          <p className="ams-card-subtitle">
            {triggeredBy
              ? <>Triggered from <strong>{triggeredBy}</strong>. Runs in an isolated shadow Kubernetes cluster.</>
              : 'Rehearse an autonomous runbook in an isolated shadow Kubernetes cluster before production rollout.'}
          </p>
        </div>

        <div className="ams-page-actions">
          {status === SIMULATION_STATUS.COMPLETED && (
            <button type="button" className="st-btn st-btn-outline" onClick={clear}>Clear log</button>
          )}
          <button type="button" className="st-btn st-btn-primary" onClick={run} disabled={isRunning}>
            <Play size={15} className={isRunning ? 'ams-spin' : undefined} aria-hidden="true" />
            {isRunning ? 'Simulating runbook…' : status === SIMULATION_STATUS.COMPLETED ? 'Re-run simulation' : 'Run simulation'}
          </button>
        </div>
      </div>

      <dl className="ams-sim-meta">
        {ENVIRONMENT.map(({ label, value }) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      {isRunning && (
        <div>
          <div className="ams-progress-label">
            <span>Agent orchestration progress</span>
            <span className="ams-text-accent">Step {currentStep} of {totalSteps}</span>
          </div>
          <div
            className="ams-progress-track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={totalSteps}
            aria-valuenow={steps.length}
            aria-label="Simulation progress"
          >
            <div className="ams-progress-fill" style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
          </div>
        </div>
      )}

      <div className="ams-console" aria-live="polite">
        <div className="ams-console-head">
          <span># DIGITAL TWIN RUNNER: Telematics partition lag recovery [TWIN-992]</span>
          <span
            className={`ams-console-status ${isRunning ? 'is-running' : ''} ${status === SIMULATION_STATUS.COMPLETED ? 'is-done' : ''}`}
          >
            {STATUS_LABEL[status]}
          </span>
        </div>

        {status === SIMULATION_STATUS.IDLE && (
          <p className="ams-console-idle">
            Click <strong>Run simulation</strong> to launch the autonomous SRE runbook in the shadow cluster.
          </p>
        )}

        {steps.map((step, index) => (
          <div key={step} className="ams-console-line">
            <span className="ams-console-time">✓ [{elapsedLabel(index)}]</span>
            <span>{step}</span>
          </div>
        ))}

        {outcome && (
          <div className="ams-console-outcome">
            <CircleCheck size={16} aria-hidden="true" />
            <span>Validation outcome: {outcome}</span>
          </div>
        )}
      </div>
    </section>
  );
}
