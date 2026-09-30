import React from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * "Next step" banner shown at the bottom of each AMS page. It keeps the
 * build → test → approve → operate flow visible without numbering the menu.
 *
 * @param {Object} props
 * @param {string} props.title  Name of the next page.
 * @param {string} [props.hint] Why the user would go there next.
 * @param {() => void} props.onClick
 * @returns {JSX.Element}
 */
export default function NextStepLink({ title, hint, onClick }) {
  return (
    <button type="button" className="ams-next-step" onClick={onClick}>
      <span>
        <span className="ams-next-step-label">Next step</span>
        <span className="ams-next-step-title">{title}</span>
        {hint && <span className="ams-next-step-hint">{hint}</span>}
      </span>
      <ArrowRight size={18} color="var(--stellantis-action)" aria-hidden="true" />
    </button>
  );
}
