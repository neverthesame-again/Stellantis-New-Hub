/**
 * @file React Flow node-type map for the playground.
 *
 * Defined once at module level: React Flow requires a stable object and warns
 * (and re-mounts every node) when a new one is passed on each render.
 */

import { WORKFLOW_NODE_TYPE } from '../../../../model/workflowModel';
import { AgentNode, ApprovalNode, EndNode, ForkNode, JoinNode, PolicyNode, StartNode } from './WorkflowNodes';

export const NODE_TYPES = Object.freeze({
  [WORKFLOW_NODE_TYPE.START]: StartNode,
  [WORKFLOW_NODE_TYPE.END]: EndNode,
  [WORKFLOW_NODE_TYPE.AGENT]: AgentNode,
  [WORKFLOW_NODE_TYPE.APPROVAL]: ApprovalNode,
  [WORKFLOW_NODE_TYPE.POLICY]: PolicyNode,
  [WORKFLOW_NODE_TYPE.FORK]: ForkNode,
  [WORKFLOW_NODE_TYPE.JOIN]: JoinNode
});
