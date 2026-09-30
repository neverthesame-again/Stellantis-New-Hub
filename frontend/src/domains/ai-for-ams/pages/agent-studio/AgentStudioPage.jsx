import React, { useState } from 'react';
import { BadgeCheck, ClipboardList, Workflow } from 'lucide-react';
import { useAmsStudio } from '../../state/useAmsStudio';
import { selectCatalogueAgents } from '../../state/selectors';
import { AMS_SUBPAGE, getAmsRoute } from '../../navigation/amsRoutes';
import { useAmsRouteRequest } from '../../navigation/useAmsNavigation';
import { STAGE } from '../../model/agentLifecycle';
import { createEmptyWorkflow } from '../../model/workflowModel';
import PageHeader from '../../components/PageHeader';
import TabBar from '../../components/TabBar';
import Toast from '../../components/Toast';
import { useToast } from '../../components/useToast';
import AgentCatalogue from './AgentCatalogue';
import OnboardingWorkspace from './onboarding/OnboardingWorkspace';
import WorkflowsTab from './workflows/WorkflowsTab';

/** Views of the Agent Studio page; other pages open one via route params `{ tab }`. */
const AGENT_STUDIO_TAB = Object.freeze({
  ONBOARDING: 'onboarding',
  PUBLISHED: 'published',
  WORKFLOWS: 'workflows'
});

/**
 * Agent Studio — one place to register agents and follow their lifecycle
 * (In onboarding), browse the published catalogue (Published) and compose
 * agents into workflows (Workflows).
 *
 * Route params: `{ tab?: 'onboarding' | 'published' | 'workflows', agentId?: string,
 * create?: boolean, workflowId?: string, register?: boolean }` — `create` opens
 * a new workflow in the playground, `workflowId` opens a saved one, `register`
 * opens the new-agent registration form.
 *
 * @returns {JSX.Element}
 */
export default function AgentStudioPage() {
  const route = getAmsRoute(AMS_SUBPAGE.AGENT_STUDIO);
  const { state } = useAmsStudio();
  const [activeTab, setActiveTab] = useState(AGENT_STUDIO_TAB.ONBOARDING);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [openWorkflow, setOpenWorkflow] = useState(null);
  const [registering, setRegistering] = useState(false);
  const { message, showToast } = useToast();

  useAmsRouteRequest(AMS_SUBPAGE.AGENT_STUDIO, (params) => {
    if (Object.values(AGENT_STUDIO_TAB).includes(params.tab)) setActiveTab(params.tab);
    if (params.agentId) setSelectedAgentId(params.agentId);
    if (params.register) {
      setActiveTab(AGENT_STUDIO_TAB.ONBOARDING);
      setRegistering(true);
    }
    if (params.create) {
      setOpenWorkflow((current) => ({ id: null, session: (current?.session ?? 0) + 1, draft: createEmptyWorkflow('New AMS workflow') }));
    } else if (params.workflowId) {
      setOpenWorkflow((current) => ({ id: params.workflowId, session: (current?.session ?? 0) + 1, draft: null }));
    } else if (params.tab === AGENT_STUDIO_TAB.WORKFLOWS) {
      setOpenWorkflow(null);
    }
  });

  const inOnboarding = state.studioAgents.filter((agent) => agent.stage < STAGE.OPERATING).length;
  const tabs = [
    { id: AGENT_STUDIO_TAB.ONBOARDING, label: 'In onboarding', icon: ClipboardList, count: inOnboarding },
    { id: AGENT_STUDIO_TAB.PUBLISHED, label: 'Published', icon: BadgeCheck, count: selectCatalogueAgents(state).length },
    { id: AGENT_STUDIO_TAB.WORKFLOWS, label: 'Workflows', icon: Workflow, count: state.workflows.length }
  ];

  return (
    <div className="ams-page animate-fade-in">
      <PageHeader icon={route.icon} title={route.label} summary={route.summary} />
      <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} ariaLabel="Agent Studio views" idPrefix="ams-agent-tab" />
      <div role="tabpanel" id="ams-agent-tab-panel" aria-labelledby={`ams-agent-tab-${activeTab}`}>
        {activeTab === AGENT_STUDIO_TAB.ONBOARDING && (
          <OnboardingWorkspace
            selectedAgentId={selectedAgentId}
            onSelectAgent={setSelectedAgentId}
            registering={registering}
            onRegisteringChange={setRegistering}
            onShowPublished={() => setActiveTab(AGENT_STUDIO_TAB.PUBLISHED)}
            showToast={showToast}
          />
        )}
        {activeTab === AGENT_STUDIO_TAB.PUBLISHED && <AgentCatalogue showToast={showToast} />}
        {activeTab === AGENT_STUDIO_TAB.WORKFLOWS && (
          <WorkflowsTab open={openWorkflow} onOpenChange={setOpenWorkflow} showToast={showToast} />
        )}
      </div>
      <Toast message={message} />
    </div>
  );
}
