/**
 * @file Hook for run playback.
 */

import { useContext } from 'react';
import { RunPlaybackContext } from './runPlaybackContext';

/**
 * Starts harness and workflow runs and reports animation progress.
 *
 * @returns {import('./runPlaybackContext').RunPlaybackValue}
 * @throws {Error} When used outside `<RunPlaybackProvider>`.
 */
export function useRunPlayback() {
  const context = useContext(RunPlaybackContext);
  if (!context) throw new Error('useRunPlayback must be used inside <RunPlaybackProvider>');
  return context;
}
