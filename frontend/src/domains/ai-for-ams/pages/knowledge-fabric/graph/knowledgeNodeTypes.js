/**
 * @file React Flow node-type map for the knowledge fabric (stable, module level).
 */

import { KnowledgeRecordNode, LaneHeaderNode } from './KnowledgeNodes';

export const KNOWLEDGE_NODE_TYPES = Object.freeze({
  record: KnowledgeRecordNode,
  lane: LaneHeaderNode
});
