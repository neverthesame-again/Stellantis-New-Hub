/**
 * @file Context shared by the playground's custom React Flow nodes.
 *
 * Node components receive only their own id and data from React Flow; the
 * agent directory, run statuses and validation highlights come from here so
 * none of that display-only information is written into the saved workflow.
 */

import { createContext, useContext } from 'react';

/** Drag-and-drop payload type for palette items dropped on the canvas. */
export const PALETTE_DRAG_TYPE = 'application/x-ams-workflow-node';

/**
 * @typedef {Object} PlaygroundContextValue
 * @property {Record<string, Object>} agentsById      Studio agents by id.
 * @property {Record<string, string>} statusByNodeId  Run status per node (see STEP_STATUS).
 * @property {Set<string>} issueNodeIds               Nodes flagged by validation.
 */

/** @type {import('react').Context<PlaygroundContextValue>} */
export const PlaygroundContext = createContext({ agentsById: {}, statusByNodeId: {}, issueNodeIds: new Set() });

/**
 * @returns {PlaygroundContextValue}
 */
export function usePlaygroundContext() {
  return useContext(PlaygroundContext);
}
