/**
 * @file Hook for page-level confirmation toasts.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_DURATION_MS = 3500;

/**
 * Manages a single transient confirmation message. Pair it with `<Toast>`.
 *
 * @param {number} [durationMs] How long a message stays visible.
 * @returns {{ message: string | null, showToast: (message: string) => void }}
 */
export function useToast(durationMs = DEFAULT_DURATION_MS) {
  const [message, setMessage] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback((text) => {
    window.clearTimeout(timerRef.current);
    setMessage(text);
    timerRef.current = window.setTimeout(() => setMessage(null), durationMs);
  }, [durationMs]);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  return { message, showToast };
}
