import React, { useEffect, useState } from 'react';
import { useAgentStudio } from '../useAgentStudio';
import { createEmptyWorkflow, createWorkflowForAgent } from './adWorkflowModel';
import WorkflowList from './WorkflowList';
import WorkflowPlayground from './WorkflowPlayground';
import './adWorkflows.css';

/** AI Studio → Workflows: the workflow list, or the playground for the open workflow. */
export default function WorkflowsTab({ showToast }) {
  const { agents, workflows, workflowRequest, consumeWorkflowRequest } = useAgentStudio();
  // `session` changes whenever a different workflow is opened so the playground remounts fresh.
  const [open, setOpen] = useState(null);
  const [handledToken, setHandledToken] = useState(null);

  const openSession = (id, draft = null) => setOpen((cur) => ({ id, session: (cur?.session ?? 0) + 1, draft }));

  if (workflowRequest && workflowRequest.token !== handledToken) {
    setHandledToken(workflowRequest.token);
    const agent = agents.find((a) => a.id === workflowRequest.withAgentId);
    if (workflowRequest.workflowId) openSession(workflowRequest.workflowId);
    else if (agent) openSession(null, createWorkflowForAgent(agent));
    else if (workflowRequest.create) openSession(null, createEmptyWorkflow('New AD workflow'));
  }
  useEffect(() => {
    if (workflowRequest) consumeWorkflowRequest();
  }, [workflowRequest, consumeWorkflowRequest]);

  const workflow = open?.id ? workflows.find((w) => w.id === open.id) : open?.draft;

  if (!open || !workflow) {
    return (
      <WorkflowList
        onOpen={(id) => openSession(id)}
        onCreate={() => openSession(null, createEmptyWorkflow('New AD workflow'))}
        showToast={showToast}
      />
    );
  }

  return (
    <WorkflowPlayground
      key={open.session}
      workflow={workflow}
      onBack={() => setOpen(null)}
      onSaved={(id) => setOpen((cur) => ({ ...cur, id, draft: null }))}
      onOpenCopy={(id) => openSession(id)}
      showToast={showToast}
    />
  );
}
