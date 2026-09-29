import { createContext, useContext } from 'react';

/**
 * Context object + hook for the Agent Studio store, kept apart from the
 * provider component so hot reload of AgentStudioContext.jsx keeps the same
 * context identity.
 */
export const AgentStudioContext = createContext(null);

export function useAgentStudio() {
  const ctx = useContext(AgentStudioContext);
  if (!ctx) throw new Error('useAgentStudio must be used inside <AgentStudioProvider>');
  return ctx;
}
