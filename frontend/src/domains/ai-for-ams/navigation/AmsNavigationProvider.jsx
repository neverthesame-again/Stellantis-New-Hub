/**
 * @file AMS in-domain navigation provider.
 *
 * AMS pages frequently hand the user over to another page ("Test in Harness",
 * "Review in Inbox", "Next step"). Rather than drilling the core tab setters
 * through every component, the AMS router exposes them once through this
 * provider, together with optional one-shot route parameters (for example
 * "start the run for this agent as soon as the Harness opens"). Pages read it
 * with the hooks in `useAmsNavigation.js`.
 */

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { AMS_MAIN_TAB } from './amsRoutes';
import { AmsNavigationContext } from './amsNavigationContext';

/**
 * Provides navigation helpers to every AMS page.
 *
 * @param {Object} props
 * @param {(tabId: string) => void} props.onTabChange       Core setter for the main tab.
 * @param {(subPageId: string) => void} props.onSubTabChange Core setter for the Experience Zone sub-page.
 * @param {import('react').ReactNode} props.children
 * @returns {JSX.Element}
 */
export default function AmsNavigationProvider({ onTabChange, onSubTabChange, children }) {
  const [routeRequest, setRouteRequest] = useState(
    /** @type {import('./amsNavigationContext').AmsRouteRequest | null} */ (null)
  );
  const requestCounter = useRef(0);

  /** Addresses one-shot parameters to a page (a sub-page id or a main tab id). */
  const request = useCallback((target, params) => {
    requestCounter.current += 1;
    setRouteRequest({ requestId: requestCounter.current, subPage: target, params });
  }, []);

  const goToTab = useCallback((tabId, params = null) => {
    if (params) request(tabId, params);
    onTabChange(tabId);
  }, [onTabChange, request]);

  const goToSubPage = useCallback((subPageId, params = null) => {
    if (params) request(subPageId, params);
    onTabChange(AMS_MAIN_TAB.EXPERIENCE);
    onSubTabChange(subPageId);
  }, [onTabChange, onSubTabChange, request]);

  const value = useMemo(() => ({ goToTab, goToSubPage, routeRequest }), [goToTab, goToSubPage, routeRequest]);

  return <AmsNavigationContext.Provider value={value}>{children}</AmsNavigationContext.Provider>;
}
