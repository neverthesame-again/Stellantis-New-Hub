import React from 'react';
import { ArrowRight, Hourglass } from 'lucide-react';
import { useAmsNavigation } from '../../navigation/useAmsNavigation';
import { AMS_MAIN_TAB, AMS_SUBPAGE } from '../../navigation/amsRoutes';
import { RUN_STATUS } from '../../model/runModel';
import { formatDateTime } from '../../utils/formatters';
import RingGauge from '../../components/RingGauge';
import RunLog from '../../components/RunLog';
import RunStatusBadge from '../../components/RunStatusBadge';
import RunStepList from '../../components/RunStepList';

/**
 * One harness run: pipeline steps, gauges, live log, the approval pause and
 * next-step links to Evaluation, Governance and FinOps (F3).
 *
 * @param {Object} props
 * @param {import('../../model/runModel').AmsRun} props.run
 * @param {Object | undefined} props.agent       The agent that ran.
 * @param {number | null} props.revealedCount   Steps revealed while animating; null otherwise.
 * @returns {JSX.Element}
 */
export default function RunDetail({ run, agent, revealedCount }) {
  const { goToTab, goToSubPage } = useAmsNavigation();
  const animating = revealedCount !== null;
  const status = animating ? RUN_STATUS.RUNNING : run.status;

  const nextSteps = [
    { label: 'Evaluation', onClick: () => goToSubPage(AMS_SUBPAGE.EVALUATE_APPROVE, { tab: 'evaluate', agentId: run.agentId }) },
    { label: 'Governance', onClick: () => goToSubPage(AMS_SUBPAGE.EVALUATE_APPROVE, { tab: 'approve', agentId: run.agentId }) },
    { label: 'FinOps', onClick: () => goToSubPage(AMS_SUBPAGE.MONITOR_FINOPS, { tab: 'cost' }) }
  ];

  return (
    <section className="st-card ams-card ams-detail" aria-labelledby="ams-run-title" aria-busy={animating}>
      <header className="ams-page-header">
        <div>
          <div className="ams-badge-row">
            <RunStatusBadge status={status} />
            <span className="st-badge badge-info">{run.id}</span>
          </div>
          <h3 id="ams-run-title" className="ams-card-title">{run.title}</h3>
          <p className="ams-card-subtitle">
            {agent?.name ?? 'Unknown agent'} · started {formatDateTime(run.startedAt)}
            {run.finishedAt && run.status !== RUN_STATUS.INTERRUPTED && ` · finished ${formatDateTime(run.finishedAt)}`}
          </p>
        </div>
      </header>

      {!animating && run.status === RUN_STATUS.AWAITING_APPROVAL && (
        <div className="ams-callout is-warning" role="status">
          <Hourglass size={16} aria-hidden="true" />
          <span>
            Paused for human approval ({run.approvalInboxItemId}). Approve it in the{' '}
            <button type="button" className="ams-link-button" onClick={() => goToTab(AMS_MAIN_TAB.INBOX)}>Workflow Inbox</button>{' '}
            to let the run finish.
          </span>
        </div>
      )}
      {run.status === RUN_STATUS.INTERRUPTED && (
        <div className="ams-callout is-info" role="status">This run was interrupted by a page reload before it finished.</div>
      )}

      <div className="ams-run-layout">
        <RunStepList run={run} revealedCount={revealedCount} />
        <div className="ams-run-side">
          {run.gauges && (
            <div className="ams-ring-row">
              <RingGauge value={run.gauges.contextConfidence} label="Context confidence" />
              <RingGauge value={run.gauges.reuseReadiness} label="Reuse readiness" />
              <RingGauge value={run.gauges.knowledgeCoverage} label="Knowledge coverage" />
            </div>
          )}
          <RunLog run={run} revealedCount={revealedCount} />
        </div>
      </div>

      {run.agentId && (
        <nav className="ams-next-links" aria-label="Next steps">
          <span className="ams-section-title">Next</span>
          {nextSteps.map(({ label, onClick }) => (
            <button key={label} type="button" className="st-btn st-btn-outline" onClick={onClick}>
              {label} <ArrowRight size={13} />
            </button>
          ))}
        </nav>
      )}
    </section>
  );
}
