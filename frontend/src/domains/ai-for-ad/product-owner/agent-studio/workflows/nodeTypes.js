import { AgentNode, ApprovalNode, EndNode, ForkNode, JoinNode, PolicyNode, StartNode } from './WorkflowNodes';

// React Flow needs a stable object; a new one per render re-mounts every node.
export const NODE_TYPES = Object.freeze({
  start: StartNode,
  end: EndNode,
  agent: AgentNode,
  approval: ApprovalNode,
  policy: PolicyNode,
  fork: ForkNode,
  join: JoinNode
});
