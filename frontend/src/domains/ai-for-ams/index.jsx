/**
 * @file AI for AMS domain entry point.
 *
 * Mirrors the other domains' `index.jsx`: the core app renders this single
 * component for AI for AMS and all AMS page routing, state and styling live
 * inside this folder. It
 * - mounts the persisted AMS studio store (per signed-in user),
 * - mounts run playback, so harness and workflow runs continue across pages,
 * - exposes in-domain navigation to AMS pages,
 * - renders Dashboard, Workflow Inbox or the AI Experience Zone sub-page, and
 * - closes every Experience Zone page with a "Next step" link so the journey
 *   reads as one flow.
 */

import React, { useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import DashboardPage from './pages/dashboard/DashboardPage';
import WorkflowInbox from './pages/WorkflowInbox';
import OpsStudioOverview from './pages/ops-studio/OpsStudioOverview';
import AgentStudioPage from './pages/agent-studio/AgentStudioPage';
import AiHarnessPage from './pages/harness/AiHarnessPage';
import EvaluateApprovePage from './pages/evaluate-approve/EvaluateApprovePage';
import KnowledgeFabricPage from './pages/knowledge-fabric/KnowledgeFabricPage';
import MonitorFinOpsPage from './pages/monitor-finops/MonitorFinOpsPage';
import ModelsToolsPage from './pages/models-tools/ModelsToolsPage';
import NextStepLink from './components/NextStepLink';
import AmsStudioProvider from './state/AmsStudioProvider';
import { buildStorageKey } from './state/amsStorage';
import AmsNavigationProvider from './navigation/AmsNavigationProvider';
import RunPlaybackProvider from './runs/RunPlaybackProvider';
import { useAmsNavigation } from './navigation/useAmsNavigation';
import {
  AMS_DEFAULT_SUBPAGE,
  AMS_MAIN_TAB,
  AMS_SUBPAGE,
  getAmsRoute,
  getNextAmsRoute,
  isAmsSubPage
} from './navigation/amsRoutes';
import './styles/ams.css';

/** Role label used in audit trails for this domain's persona. */
const AMS_ROLE_LABEL = 'Head of AMS';

/** Page component for each AI Experience Zone sub-page. */
const SUBPAGE_COMPONENTS = Object.freeze({
  [AMS_SUBPAGE.OPS_STUDIO]: OpsStudioOverview,
  [AMS_SUBPAGE.AGENT_STUDIO]: AgentStudioPage,
  [AMS_SUBPAGE.HARNESS]: AiHarnessPage,
  [AMS_SUBPAGE.EVALUATE_APPROVE]: EvaluateApprovePage,
  [AMS_SUBPAGE.KNOWLEDGE_FABRIC]: KnowledgeFabricPage,
  [AMS_SUBPAGE.MONITOR_FINOPS]: MonitorFinOpsPage,
  [AMS_SUBPAGE.MODELS_TOOLS]: ModelsToolsPage
});

/**
 * Renders the AI Experience Zone sub-page followed by its "Next step" link.
 * The hint comes from the current page's route: it explains why the user
 * would move on to the following page.
 *
 * @param {Object} props
 * @param {string} props.subPageId A valid AMS sub-page id.
 * @returns {JSX.Element}
 */
function ExperienceZone({ subPageId }) {
  const { goToSubPage } = useAmsNavigation();
  const Page = SUBPAGE_COMPONENTS[subPageId];
  const nextRoute = getNextAmsRoute(subPageId);

  return (
    <div className="ams-page">
      <Page />
      {nextRoute && (
        <NextStepLink
          title={nextRoute.label}
          hint={getAmsRoute(subPageId).nextStepHint}
          onClick={() => goToSubPage(nextRoute.id)}
        />
      )}
    </div>
  );
}

/**
 * Chooses and renders the AMS page for the current core navigation state.
 *
 * @param {Object} props
 * @param {string} props.activeTab
 * @param {string | null} props.activeSubTab
 * @param {(subPageId: string) => void} props.onSubTabChange
 * @returns {JSX.Element | null}
 */
function AmsDomainContent({ activeTab, activeSubTab, onSubTabChange }) {
  const { goToTab, goToSubPage } = useAmsNavigation();
  const subPageId = isAmsSubPage(activeSubTab) ? activeSubTab : AMS_DEFAULT_SUBPAGE;

  // A sub-page id saved by an older build (or by another domain) is not valid
  // here; point the sidebar at the page actually shown.
  useEffect(() => {
    if (activeTab === AMS_MAIN_TAB.EXPERIENCE && !isAmsSubPage(activeSubTab)) {
      onSubTabChange(AMS_DEFAULT_SUBPAGE);
    }
  }, [activeTab, activeSubTab, onSubTabChange]);

  switch (activeTab) {
    case AMS_MAIN_TAB.DASHBOARD:
      return (
        <DashboardPage
          onNavigateToInbox={() => goToTab(AMS_MAIN_TAB.INBOX)}
          onNavigateToExperience={() => goToSubPage(AMS_SUBPAGE.HARNESS)}
        />
      );
    case AMS_MAIN_TAB.INBOX:
      return <WorkflowInbox />;
    case AMS_MAIN_TAB.EXPERIENCE:
      return <ExperienceZone subPageId={subPageId} />;
    default:
      return null;
  }
}

/**
 * AI for AMS domain root, rendered by the core app when the AMS domain is selected.
 *
 * @param {Object} props
 * @param {string} props.activeTab                      Core main tab id.
 * @param {(tabId: string) => void} props.onTabChange   Core main tab setter.
 * @param {string | null} props.activeSubTab            Core Experience Zone sub-page id.
 * @param {(subPageId: string) => void} props.onSubTabChange Core sub-page setter.
 * @returns {JSX.Element}
 */
export default function AiForAmsDomain({ activeTab, onTabChange, activeSubTab, onSubTabChange }) {
  const { user } = useAuth();
  const storageKey = buildStorageKey(user?.id ?? user?.email);
  const actor = `${user?.full_name || 'Tony'} / ${AMS_ROLE_LABEL}`;

  return (
    <AmsStudioProvider key={storageKey} storageKey={storageKey} actor={actor}>
      <RunPlaybackProvider>
        <AmsNavigationProvider onTabChange={onTabChange} onSubTabChange={onSubTabChange}>
          <AmsDomainContent activeTab={activeTab} activeSubTab={activeSubTab} onSubTabChange={onSubTabChange} />
        </AmsNavigationProvider>
      </RunPlaybackProvider>
    </AmsStudioProvider>
  );
}
