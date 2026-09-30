import React from 'react';
import { CircleCheck, CircleX, TriangleAlert } from 'lucide-react';

export default function ValidationPanel({ issues, onFocusNodes, onClose }) {
  const errors = issues.filter((i) => i.severity === 'error').length;
  return (
    <section className={`ad-wf-callout ${errors ? 'is-warning' : 'is-success'} ad-wf-validation`} aria-label="Validation results" role="status">
      <div className="ad-wf-validation-head">
        {errors
          ? <strong>{errors} error(s) — fix them before running.</strong>
          : <><CircleCheck size={16} aria-hidden="true" /> <strong>The workflow is valid{issues.length ? ' (with warnings)' : ''}.</strong></>}
        <button type="button" className="ad-wf-link" onClick={onClose}>Hide</button>
      </div>
      {issues.length > 0 && (
        <ul className="ad-wf-validation-list">
          {issues.map((issue) => (
            <li key={issue.message}>
              {issue.severity === 'error' ? <CircleX size={14} aria-label="Error" /> : <TriangleAlert size={14} aria-label="Warning" />}
              <span>{issue.message}</span>
              {issue.nodeIds.length > 0 && (
                <button type="button" className="ad-wf-link" onClick={() => onFocusNodes(issue.nodeIds)}>Show</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
