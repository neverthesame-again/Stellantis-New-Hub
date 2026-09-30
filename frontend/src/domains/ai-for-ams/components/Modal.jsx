import React, { useEffect, useId, useLayoutEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * Accessible modal dialog. Closes on Escape and on backdrop click, and moves
 * focus into the dialog when it opens.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {import('react').ComponentType<{ size?: number }>} [props.icon] Optional title icon.
 * @param {() => void} props.onClose
 * @param {number} [props.maxWidth]   Dialog width in pixels (default 560).
 * @param {import('react').ReactNode} [props.footer] Action buttons.
 * @param {import('react').ReactNode} props.children
 * @returns {JSX.Element}
 */
export default function Modal({ title, icon: Icon, onClose, maxWidth = 560, footer, children }) {
  const titleId = useId();
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);

  // Track the latest handler so the mount effect below never re-runs; re-running
  // it would pull focus back to the dialog while the user types in a field.
  useLayoutEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', handleKeyDown);
    dialogRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className="ams-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="st-card ams-modal animate-fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        style={{ '--ams-modal-width': `${maxWidth}px` }}
      >
        <div className="ams-modal-header">
          <h3 id={titleId} className="ams-modal-title">
            {Icon && <Icon size={18} aria-hidden="true" />}
            {title}
          </h3>
          <button type="button" className="st-btn st-btn-outline" onClick={onClose} aria-label="Close dialog">
            <X size={15} />
          </button>
        </div>
        <div className="ams-modal-body">{children}</div>
        {footer && <div className="ams-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
