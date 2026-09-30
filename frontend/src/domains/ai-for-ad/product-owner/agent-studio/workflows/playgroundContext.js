import { createContext, useContext } from 'react';

export const PALETTE_DRAG_TYPE = 'application/x-ad-workflow-node';

export const PlaygroundContext = createContext({ agentsById: {}, statusByNodeId: {}, issueNodeIds: new Set() });

export const usePlaygroundContext = () => useContext(PlaygroundContext);
