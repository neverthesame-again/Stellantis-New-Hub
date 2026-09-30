import React from 'react';
import { CONNECTION_STATUS } from '../model/agentOptions';

const PRESENTATION = {
  [CONNECTION_STATUS.CONNECTED]: { className: 'badge-success', label: 'Connected' },
  [CONNECTION_STATUS.FAILED]: { className: 'badge-critical', label: 'Failed' },
  [CONNECTION_STATUS.NOT_VERIFIED]: { className: 'badge-high', label: 'Not verified' }
};

/**
 * Badge for a runtime connection status, with latency when connected.
 *
 * @param {Object} props
 * @param {'connected' | 'failed' | 'not-verified'} [props.status]
 * @param {number | null} [props.latencyMs]
 * @returns {JSX.Element}
 */
export default function ConnectionBadge({ status = CONNECTION_STATUS.NOT_VERIFIED, latencyMs }) {
  const { className, label } = PRESENTATION[status] ?? PRESENTATION[CONNECTION_STATUS.NOT_VERIFIED];
  return (
    <span className={`st-badge ${className}`}>
      {label}{status === CONNECTION_STATUS.CONNECTED && latencyMs ? ` · ${latencyMs} ms` : ''}
    </span>
  );
}
