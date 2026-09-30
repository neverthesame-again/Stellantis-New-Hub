/**
 * @file Custom React Flow node components for the workflow playground.
 */

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Bot, CircleStop, GitFork, GitMerge, Play, ShieldCheck, UserCheck } from 'lucide-react';
import { getAreaLabel } from '../../../../model/agentOptions';
import { GOVERNANCE_POLICIES } from '../../../../model/governancePolicies';
import { WORKFLOW_NODE_DEFINITIONS, WORKFLOW_NODE_TYPE } from '../../../../model/workflowModel';
import { usePlaygroundContext } from './playgroundContext';

/**
 * Shared frame for every node: icon, title, subtitle, handles, and styling
 * for selection, validation issues and run status.
 *
 * @param {Object} props
 * @param {string} props.id
 * @param {string} props.type
 * @param {boolean} props.selected
 * @param {import('react').ComponentType<{ size?: number }>} props.icon
 * @param {string} props.title
 * @param {string} [props.subtitle]
 * @param {import('react').ReactNode} [props.badge]
 * @returns {JSX.Element}
 */
function NodeFrame({ id, type, selected, icon: Icon, title, subtitle, badge }) {
  const { statusByNodeId, issueNodeIds } = usePlaygroundContext();
  const definition = WORKFLOW_NODE_DEFINITIONS[type];
  const status = statusByNodeId[id];
  const classes = [
    'ams-flow-node',
    `is-${type}`,
    selected ? 'is-selected' : '',
    issueNodeIds.has(id) ? 'has-issue' : '',
    status ? `run-${status}` : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} title={definition.description}>
      {definition.hasInput && <Handle type="target" position={Position.Left} />}
      <div className="ams-flow-node-head">
        <Icon size={14} aria-hidden="true" />
        <span className="ams-flow-node-kind">{definition.label}</span>
        {badge}
      </div>
      <div className="ams-flow-node-title">{title}</div>
      {subtitle && <div className="ams-flow-node-subtitle">{subtitle}</div>}
      {definition.hasOutput && <Handle type="source" position={Position.Right} />}
    </div>
  );
}

/** @param {import('@xyflow/react').NodeProps} props */
export function StartNode({ id, selected }) {
  return <NodeFrame id={id} type={WORKFLOW_NODE_TYPE.START} selected={selected} icon={Play} title="Incident received" />;
}

/** @param {import('@xyflow/react').NodeProps} props */
export function EndNode({ id, selected }) {
  return <NodeFrame id={id} type={WORKFLOW_NODE_TYPE.END} selected={selected} icon={CircleStop} title="Flow complete" />;
}

/** @param {import('@xyflow/react').NodeProps} props */
export function AgentNode({ id, data, selected }) {
  const { agentsById } = usePlaygroundContext();
  const agent = agentsById[data.agentId];
  return (
    <NodeFrame
      id={id}
      type={WORKFLOW_NODE_TYPE.AGENT}
      selected={selected}
      icon={Bot}
      title={agent?.name ?? 'Choose an agent'}
      subtitle={agent ? `${getAreaLabel(agent.area)} · stage ${agent.stage}` : 'Select this node to pick one'}
      badge={agent?.serviceTier ? <span className="ams-flow-node-tier">{agent.serviceTier}</span> : null}
    />
  );
}

/** @param {import('@xyflow/react').NodeProps} props */
export function ApprovalNode({ id, data, selected }) {
  return <NodeFrame id={id} type={WORKFLOW_NODE_TYPE.APPROVAL} selected={selected} icon={UserCheck} title={data.approver} subtitle="Pauses in the Workflow Inbox" />;
}

/** @param {import('@xyflow/react').NodeProps} props */
export function PolicyNode({ id, data, selected }) {
  const policy = GOVERNANCE_POLICIES.find((candidate) => candidate.id === data.policyId);
  return <NodeFrame id={id} type={WORKFLOW_NODE_TYPE.POLICY} selected={selected} icon={ShieldCheck} title={policy?.label ?? 'Choose a policy'} />;
}

/** @param {import('@xyflow/react').NodeProps} props */
export function ForkNode({ id, selected }) {
  return <NodeFrame id={id} type={WORKFLOW_NODE_TYPE.FORK} selected={selected} icon={GitFork} title="Run branches in parallel" />;
}

/** @param {import('@xyflow/react').NodeProps} props */
export function JoinNode({ id, selected }) {
  return <NodeFrame id={id} type={WORKFLOW_NODE_TYPE.JOIN} selected={selected} icon={GitMerge} title="Wait for all branches" />;
}
