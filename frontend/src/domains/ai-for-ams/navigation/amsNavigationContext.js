/**
 * @file React context object for AMS in-domain navigation.
 *
 * Kept in its own module so the provider file exports only a component (which
 * keeps React Fast Refresh working) and the hooks file only hooks.
 */

import { createContext } from 'react';

/**
 * @typedef {Object} AmsRouteRequest
 * @property {number} requestId Monotonic id; lets a page react to each request exactly once.
 * @property {string} subPage   Page the parameters are addressed to (sub-page id or main tab id).
 * @property {Object} params    Free-form parameters understood by that page.
 */

/**
 * @typedef {Object} AmsNavigationValue
 * @property {(tabId: string, params?: Object | null) => void} goToTab
 * @property {(subPageId: string, params?: Object | null) => void} goToSubPage
 * @property {AmsRouteRequest | null} routeRequest
 */

/** @type {import('react').Context<AmsNavigationValue | null>} */
export const AmsNavigationContext = createContext(null);
