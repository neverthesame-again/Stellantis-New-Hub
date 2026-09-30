import React from 'react';
import { RUN_STATUS } from '../model/runModel';

const PRESENTATION = {
  [RUN_STATUS.RUNNING]: { className: 'badge-info', label: 'Running' },
  [RUN_STATUS.AWAITING_APPROVAL]: { className: 'badge-high', label: 'Awaiting approval' },
  [RUN_STATUS.PASSED]: { className: 'badge-success', label: 'Passed' },
  [RUN_STATUS.FAILED]: { className: 'badge-critical', label: 'Failed' },
  [RUN_STATUS.REJECTED]: { className: 'badge-critical', label: 'Rejected' },
  [RUN_STATUS.INTERRUPTED]: { className: 'badge-purple', label: 'Interrupted' }
};

/**
 * Badge for a harness or workflow run status.
 *
 * @param {Object} props
 * @param {string} props.status One of RUN_STATUS.
 * @returns {JSX.Element}
 */
export default function RunStatusBadge({ status }) {
  const { className, label } = PRESENTATION[status] ?? PRESENTATION[RUN_STATUS.INTERRUPTED];
  return <span className={`st-badge ${className}`}>{label}</span>;
}
