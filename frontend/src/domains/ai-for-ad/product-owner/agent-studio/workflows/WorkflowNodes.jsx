import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Bot, CircleStop, GitFork, GitMerge, Play, ShieldCheck, UserCheck } from 'lucide-react';
import { WORKFLOW_NODE_DEFINITIONS, WORKFLOW_POLICIES } from './adWorkflowModel';
import { usePlaygroundContext } from './playgroundContext';

function NodeFrame({ id, type, selected, icon: Icon, title, subtitle, badge }) {
  const { statusByNodeId, issueNodeIds } = usePlaygroundContext();
  const definition = WORKFLOW_NODE_DEFINITIONS[type];
  const status = statusByNodeId[id];
  const classes = [
    'ad-wf-node',
    `is-${type}`,
    selected ? 'is-selected' : '',
    issueNodeIds.has(id) ? 'has-issue' : '',
    status ? `run-${status}` : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} title={definition.description}>
      {definition.hasInput && <Handle type="target" position={Position.Left} />}
      <div className="ad-wf-node-head">
        <Icon size={14} aria-hidden="true" />
        <span className="ad-wf-node-kind">{definition.label}</span>
        {badge}
      </div>
      <div className="ad-wf-node-title">{title}</div>
      {subtitle && <div className="ad-wf-node-subtitle">{subtitle}</div>}
      {definition.hasOutput && <Handle type="source" position={Position.Right} />}
    </div>
  );
}

export function StartNode({ id, selected }) {
  return <NodeFrame id={id} type="start" selected={selected} icon={Play} title="Work item received" />;
}

export function EndNode({ id, selected }) {
  return <NodeFrame id={id} type="end" selected={selected} icon={CircleStop} title="Flow complete" />;
}

export function AgentNode({ id, data, selected }) {
  const { agentsById } = usePlaygroundContext();
  const agent = agentsById[data.agentId];
  return (
    <NodeFrame
      id={id}
      type="agent"
      selected={selected}
      icon={Bot}
      title={agent?.name ?? 'Choose an agent'}
      subtitle={agent ? `${agent.subDomain} · stage ${agent.stage}/9` : 'Select this node to pick one'}
      badge={agent ? <span className={`ad-wf-node-asil asil-${agent.asil}`}>ASIL {agent.asil}</span> : null}
    />
  );
}

export function ApprovalNode({ id, data, selected }) {
  return <NodeFrame id={id} type="approval" selected={selected} icon={UserCheck} title={data.approver} subtitle="Pauses for sign-off" />;
}

export function PolicyNode({ id, data, selected }) {
  const policy = WORKFLOW_POLICIES.find((p) => p.id === data.policyId);
  return <NodeFrame id={id} type="policy" selected={selected} icon={ShieldCheck} title={policy?.name ?? 'Choose a policy'} subtitle={policy?.standard} />;
}

export function ForkNode({ id, selected }) {
  return <NodeFrame id={id} type="fork" selected={selected} icon={GitFork} title="Run branches in parallel" />;
}

export function JoinNode({ id, selected }) {
  return <NodeFrame id={id} type="join" selected={selected} icon={GitMerge} title="Wait for all branches" />;
}
