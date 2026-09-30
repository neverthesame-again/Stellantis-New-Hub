import React from 'react';

/**
 * Standard header for AMS pages: icon, title, one-line summary and optional actions.
 *
 * @param {Object} props
 * @param {import('react').ComponentType<{ size?: number }>} props.icon Lucide icon.
 * @param {string} props.title   Page title.
 * @param {string} [props.summary] One-line description of what the page is for.
 * @param {import('react').ReactNode} [props.actions] Buttons shown on the right.
 * @returns {JSX.Element}
 */
export default function PageHeader({ icon: Icon, title, summary, actions }) {
  return (
    <header className="ams-page-header">
      <div className="ams-page-heading">
        <div className="ams-page-icon" aria-hidden="true">
          <Icon size={19} />
        </div>
        <div>
          <h2 className="ams-page-title">{title}</h2>
          {summary && <p className="ams-page-summary">{summary}</p>}
        </div>
      </div>
      {actions && <div className="ams-page-actions">{actions}</div>}
    </header>
  );
}
