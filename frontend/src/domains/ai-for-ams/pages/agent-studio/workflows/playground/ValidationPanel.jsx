import React from 'react';
import { CircleCheck, CircleX, TriangleAlert } from 'lucide-react';

/**
 * Validation results; each issue can focus the nodes it concerns.
 *
 * @param {Object} props
 * @param {import('../../../../model/workflowModel').ValidationIssue[]} props.issues
 * @param {(nodeIds: string[]) => void} props.onFocusNodes
 * @param {() => void} props.onClose
 * @returns {JSX.Element}
 */
export default function ValidationPanel({ issues, onFocusNodes, onClose }) {
  const errors = issues.filter((issue) => issue.severity === 'error').length;
  return (
    <section className={`ams-callout ${errors ? 'is-warning' : 'is-success'} ams-validation`} aria-label="Validation results" role="status">
      <div className="ams-validation-head">
        {errors
          ? <strong>{errors} error(s) — fix them before running.</strong>
          : <><CircleCheck size={16} aria-hidden="true" /> <strong>The workflow is valid{issues.length ? ' (with warnings)' : ''}.</strong></>}
        <button type="button" className="ams-link-button" onClick={onClose}>Hide</button>
      </div>
      {issues.length > 0 && (
        <ul className="ams-validation-list">
          {issues.map((issue) => (
            <li key={issue.message}>
              {issue.severity === 'error'
                ? <CircleX size={14} aria-label="Error" />
                : <TriangleAlert size={14} aria-label="Warning" />}
              <span>{issue.message}</span>
              {issue.nodeIds.length > 0 && (
                <button type="button" className="ams-link-button" onClick={() => onFocusNodes(issue.nodeIds)}>Show</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
