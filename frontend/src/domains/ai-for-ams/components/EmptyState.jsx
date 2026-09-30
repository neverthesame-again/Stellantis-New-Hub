import React from 'react';

/**
 * Message shown when a list or grid has nothing to display.
 *
 * @param {Object} props
 * @param {string} props.message
 * @param {import('react').ReactNode} [props.action] Optional recovery action, e.g. "Clear filters".
 * @returns {JSX.Element}
 */
export default function EmptyState({ message, action }) {
  return (
    <div className="ams-empty" role="status">
      <p>{message}</p>
      {action && <div className="ams-empty-action">{action}</div>}
    </div>
  );
}
