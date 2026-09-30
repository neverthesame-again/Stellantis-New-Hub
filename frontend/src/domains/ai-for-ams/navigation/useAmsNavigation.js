/**
 * @file Hooks for AMS in-domain navigation.
 */

import { useContext, useEffect, useLayoutEffect, useRef } from 'react';
import { AmsNavigationContext } from './amsNavigationContext';

/**
 * Accesses AMS navigation helpers.
 *
 * @returns {import('./amsNavigationContext').AmsNavigationValue}
 * @throws {Error} When used outside `<AmsNavigationProvider>`.
 */
export function useAmsNavigation() {
  const context = useContext(AmsNavigationContext);
  if (!context) throw new Error('useAmsNavigation must be used inside <AmsNavigationProvider>');
  return context;
}

/**
 * Delivers the route parameters addressed to a page, once per navigation
 * request. Safe under React StrictMode's double-invoked effects because the
 * request id — not effect execution — decides whether a request is new.
 *
 * @param {string} subPageId The page asking for its parameters.
 * @param {(params: Object) => void} onRequest Called once for each new request.
 */
export function useAmsRouteRequest(subPageId, onRequest) {
  const { routeRequest } = useAmsNavigation();
  const handledRequestId = useRef(0);
  const callbackRef = useRef(onRequest);

  // Keep the latest callback without re-running the request effect on every render.
  useLayoutEffect(() => {
    callbackRef.current = onRequest;
  });

  useEffect(() => {
    if (!routeRequest || routeRequest.subPage !== subPageId) return;
    if (routeRequest.requestId <= handledRequestId.current) return;
    handledRequestId.current = routeRequest.requestId;
    callbackRef.current(routeRequest.params);
  }, [routeRequest, subPageId]);
}
