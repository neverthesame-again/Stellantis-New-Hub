import React from 'react';
import { CircleCheck } from 'lucide-react';

/**
 * Floating confirmation toast, announced politely to screen readers.
 * Drive it with the `useToast` hook.
 *
 * @param {Object} props
 * @param {string | null} props.message Nothing is rendered when null.
 * @returns {JSX.Element | null}
 */
export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="ams-toast" role="status" aria-live="polite">
      <CircleCheck size={18} color="#10b981" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
