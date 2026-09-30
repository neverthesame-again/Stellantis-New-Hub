import React from 'react';
import { useAmsStudio } from '../../../state/useAmsStudio';
import { createEmptyWorkflow } from '../../../model/workflowModel';
import WorkflowList from './WorkflowList';
import WorkflowPlayground from './playground/WorkflowPlayground';

/**
 * @typedef {Object} OpenWorkflow
 * @property {string | null} id       Saved workflow id; null for a new, unsaved one.
 * @property {number} session         Changes whenever a different workflow is opened,
 *                                    so the playground remounts with fresh state.
 * @property {Object | null} draft    The new workflow being built when `id` is null.
 */

/**
 * Agent Studio → Workflows: the workflow list, or the playground for the
 * workflow being edited (F9).
 *
 * @param {Object} props
 * @param {OpenWorkflow | null} props.open
 * @param {(open: OpenWorkflow | null) => void} props.onOpenChange
 * @param {(message: string) => void} props.showToast
 * @returns {JSX.Element}
 */
export default function WorkflowsTab({ open, onOpenChange, showToast }) {
  const { state } = useAmsStudio();

  const openSession = (id, draft = null) => {
    onOpenChange({ id, session: (open?.session ?? 0) + 1, draft });
  };

  const workflow = open?.id ? state.workflows.find((candidate) => candidate.id === open.id) : open?.draft;

  if (!open || !workflow) {
    return (
      <WorkflowList
        onOpen={(id) => openSession(id)}
        onCreate={() => openSession(null, createEmptyWorkflow('New AMS workflow'))}
        showToast={showToast}
      />
    );
  }

  return (
    <WorkflowPlayground
      key={open.session}
      workflow={workflow}
      onBack={() => onOpenChange(null)}
      onSaved={(id) => onOpenChange({ ...open, id, draft: null })}
      onOpenCopy={(id) => openSession(id)}
      showToast={showToast}
    />
  );
}
