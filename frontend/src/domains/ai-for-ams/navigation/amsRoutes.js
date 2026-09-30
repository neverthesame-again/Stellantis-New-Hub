/**
 * @file AMS route catalogue.
 *
 * Single source of truth for the AI for AMS navigation structure. The core
 * sidebar (`core/navConfig.js`) reads {@link AMS_EXPERIENCE_SUBPAGES} to draw
 * the AI Experience Zone entries, and the AMS domain router
 * (`domains/ai-for-ams/index.jsx`) uses the same ids to pick which page to
 * render — so the menu and the pages can never drift apart.
 *
 * The sub-pages are listed in the order an AMS user works through them:
 * plan → build → test → assure → know → run and pay → reference catalogues.
 * Each entry names the next step so every page can end with a
 * "Next step" link that keeps the flow visible without numbering the menu.
 *
 * This module must stay free of React components so the core navigation can
 * import it without pulling AMS pages into the core bundle graph.
 */

import {
  LayoutGrid,
  Bot,
  CirclePlay,
  ShieldCheck,
  Network,
  Activity,
  Library
} from 'lucide-react';
import { amsExperienceData } from '../mockData.js';

/** Top-level tabs shared by every domain (owned by the core sidebar). */
export const AMS_MAIN_TAB = Object.freeze({
  DASHBOARD: 'dashboard',
  INBOX: 'inbox',
  EXPERIENCE: 'experience'
});

/** Identifiers of the AI Experience Zone sub-pages for AI for AMS. */
export const AMS_SUBPAGE = Object.freeze({
  OPS_STUDIO: 'ops-studio',
  AGENT_STUDIO: 'agent-studio',
  HARNESS: 'harness',
  EVALUATE_APPROVE: 'evaluate-approve',
  KNOWLEDGE_FABRIC: 'knowledge-fabric',
  MODELS_TOOLS: 'models-tools',
  MONITOR_FINOPS: 'monitor-finops'
});

/**
 * @typedef {Object} AmsSubPageRoute
 * @property {string} id            One of {@link AMS_SUBPAGE}.
 * @property {string} label         Menu label shown in the sidebar.
 * @property {import('react').ComponentType} icon  Lucide icon component.
 * @property {string} summary       One-line purpose, used by page headers and Ops Studio.
 * @property {string} [nextStepHint] Why the user would move on to the following page.
 * @property {string} [badge]       Optional static count shown in the sidebar.
 */

/**
 * AI Experience Zone sub-pages in journey order. The first entry is the
 * default landing page when the user opens the zone.
 *
 * @type {ReadonlyArray<AmsSubPageRoute>}
 */
export const AMS_EXPERIENCE_SUBPAGES = Object.freeze([
  {
    id: AMS_SUBPAGE.OPS_STUDIO,
    label: 'Ops Studio',
    icon: LayoutGrid,
    summary: 'Your starting point: where every AMS agent is in its journey and what to do next.',
    nextStepHint: 'Register a new agent or pick up one that is in onboarding.'
  },
  {
    id: AMS_SUBPAGE.AGENT_STUDIO,
    label: 'Agent Studio',
    icon: Bot,
    summary: 'Register AMS agents, track their lifecycle, browse published agents and compose them into workflows.',
    nextStepHint: 'Test an agent on a real ticket before it is evaluated.'
  },
  {
    id: AMS_SUBPAGE.HARNESS,
    label: 'AI Harness',
    icon: CirclePlay,
    summary: 'Run an agent against a real ticket and watch each pipeline step before it touches production.',
    nextStepHint: 'Score the agent and send it for approval.'
  },
  {
    id: AMS_SUBPAGE.EVALUATE_APPROVE,
    label: 'Evaluate & Approve',
    icon: ShieldCheck,
    summary: 'Score agents against the AMS quality bar and approve them against operating policies.',
    nextStepHint: 'Check what the agent knows and where the technical debt sits.'
  },
  {
    id: AMS_SUBPAGE.KNOWLEDGE_FABRIC,
    label: 'Knowledge Fabric',
    icon: Network,
    summary: 'See how incidents, services, changes, logs, known errors and runbooks connect — and which agents use them.',
    nextStepHint: 'Browse the approved models and tools agents can use.'
  },
  {
    id: AMS_SUBPAGE.MODELS_TOOLS,
    label: 'Models & Tools',
    icon: Library,
    summary: 'Approved AI models and tools available to AMS agents.',
    nextStepHint: 'Watch running agents and what they cost.',
    badge: String(amsExperienceData.models.length + amsExperienceData.tools.length)
  },
  {
    id: AMS_SUBPAGE.MONITOR_FINOPS,
    label: 'Monitor & FinOps',
    icon: Activity,
    summary: 'Runtime health, AI spend and your active subscriptions in one place.'
  }
]);

/** Sub-page opened when the user enters the AI Experience Zone. */
export const AMS_DEFAULT_SUBPAGE = AMS_EXPERIENCE_SUBPAGES[0].id;

/**
 * Checks whether an id belongs to the AMS AI Experience Zone.
 *
 * @param {string | null | undefined} subPageId Candidate id (may come from session storage).
 * @returns {boolean} True when the id is a known AMS sub-page.
 */
export function isAmsSubPage(subPageId) {
  return AMS_EXPERIENCE_SUBPAGES.some((route) => route.id === subPageId);
}

/**
 * Looks up the route metadata for a sub-page.
 *
 * @param {string} subPageId One of {@link AMS_SUBPAGE}.
 * @returns {AmsSubPageRoute | undefined} The route, or undefined for unknown ids.
 */
export function getAmsRoute(subPageId) {
  return AMS_EXPERIENCE_SUBPAGES.find((route) => route.id === subPageId);
}

/**
 * Returns the route that follows the given one in the journey order.
 *
 * @param {string} subPageId One of {@link AMS_SUBPAGE}.
 * @returns {AmsSubPageRoute | null} The next route, or null for the last page.
 */
export function getNextAmsRoute(subPageId) {
  const index = AMS_EXPERIENCE_SUBPAGES.findIndex((route) => route.id === subPageId);
  if (index === -1 || index === AMS_EXPERIENCE_SUBPAGES.length - 1) return null;
  return AMS_EXPERIENCE_SUBPAGES[index + 1];
}
