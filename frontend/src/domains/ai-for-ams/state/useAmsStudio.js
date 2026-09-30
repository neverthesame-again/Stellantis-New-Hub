/**
 * @file Hook for the AMS studio store.
 */

import { useContext } from 'react';
import { AmsStudioContext } from './amsStudioContext';

/**
 * Accesses the AMS studio store: current state, actions and the acting user.
 *
 * @returns {import('./amsStudioContext').AmsStudioValue}
 * @throws {Error} When used outside `<AmsStudioProvider>`.
 */
export function useAmsStudio() {
  const context = useContext(AmsStudioContext);
  if (!context) throw new Error('useAmsStudio must be used inside <AmsStudioProvider>');
  return context;
}
