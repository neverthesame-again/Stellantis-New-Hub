import React, { useState } from 'react';
import {
  Sliders,
  Cpu,
  Bot,
  Wrench,
  BookmarkCheck,
  Inbox,
  PlayCircle,
  Gauge,
  Scale
} from 'lucide-react';
import AdPersonaDashboard from './AdPersonaDashboard';
import AdPmWorkflowInbox from './AdPmWorkflowInbox';
import AdModelCatalogue from './AdModelCatalogue';
import AdAgentWorkflowCatalogue from './AdAgentWorkflowCatalogue';
import AdAiToolsCatalogue from './AdAiToolsCatalogue';
import AdMySubscriptions from './AdMySubscriptions';
import { AgentStudioProvider } from '../agent-studio/AgentStudioContext';
import { useAgentStudio } from '../agent-studio/useAgentStudio';
import AdAgentHarness from '../agent-studio/pages/AdAgentHarness';
import AdAgentEvaluation from '../agent-studio/pages/AdAgentEvaluation';
import AdAgentGovernance from '../agent-studio/pages/AdAgentGovernance';
import '../adPersonaDashboard.css';

/**
 * AI Experience Zone — AI for AD (Automated Driving)
 * Peer-Level Sub-Tabs Architecture for PRD Section 5
 * 
 * Sub-Tabs:
 * 1. Persona Dashboard (Master Cockpit)
 * 2. Workflow Inbox (9 PRD Decision Items Across 3 Lanes)
 * 3. Model Catalogue (8 Enterprise Foundation Models)
 * 4. Agent & Workflow Catalogue (8 Registered: 2 Active, 2 Experimental, 2 Suspended, 2 Retired)
 * 5. AI Tools Catalogue (23 Tools Across 10 Engineering Lifecycle Disciplines)
 * 6. My Subscriptions (20 Active Subscriptions Across 5 Inheritance Levels)
 * 7. AI Harness (F3), 8. Evaluation Center (F5), 9. Governance Center (F4)
 *
 * F1/F2 (Agent Onboarding Studio + lifecycle) live inside the Agent & Workflow
 * Catalogue. All Agent Studio features share state via AgentStudioProvider.
 */
export default function AdExperienceZone({ activeSubTab, onSubTabChange, onNavigateToInbox }) {
  const currentSubTab = activeSubTab || 'persona';
  return (
    <AgentStudioProvider onNavigate={onSubTabChange}>
      <ExperienceZoneTabs
        activeSubTab={currentSubTab}
        setActiveSubTab={onSubTabChange}
        onSubTabChange={onSubTabChange}
        onNavigateToInbox={onNavigateToInbox}
      />
    </AgentStudioProvider>
  );
}

function ExperienceZoneTabs({ activeSubTab, setActiveSubTab, onSubTabChange, onNavigateToInbox }) {
  const currentSubTab = activeSubTab || 'persona';
  const [targetDrillDownLevel, setTargetDrillDownLevel] = useState(null);
  const { agents, harnessRuns } = useAgentStudio();

  const pendingApprovals = agents.filter((a) => a.governance.status === 'pending').length
    + harnessRuns.filter((r) => r.status === 'awaiting_approval').length;
  const evaluatedCount = agents.filter((a) => a.evaluation).length;
  // Catalogue = studio agents + 2 retired legacy agents that only exist in the catalogue
  const catalogueCount = agents.length + 2;
  const SUB_TABS = [
    { id: 'persona', label: 'Persona Dashboard', icon: Sliders },
    { id: 'inbox', label: 'Workflow Inbox', icon: Inbox, badge: '9' },
    { id: 'models', label: 'Model Catalogue', icon: Cpu, badge: '8' },
    { id: 'agents', label: 'Agent Catalogue', icon: Bot, badge: String(catalogueCount) },
    { id: 'harness', label: 'AI Harness', icon: PlayCircle, badge: String(harnessRuns.length) },
    { id: 'evaluation', label: 'Evaluation Center', icon: Gauge, badge: String(evaluatedCount) },
    { id: 'governance', label: 'Governance Center', icon: Scale, badge: pendingApprovals ? String(pendingApprovals) : null },
    { id: 'tools', label: 'AI Tools Catalogue', icon: Wrench, badge: '23' },
    { id: 'subscriptions', label: 'My Subscriptions', icon: BookmarkCheck, badge: '20' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>


      {/* SUB-TAB 1: PERSONA DASHBOARD (Fully Implemented) */}
      {currentSubTab === 'persona' && (
        <AdPersonaDashboard
          initialLevel={targetDrillDownLevel}
          onNavigateToInbox={() => { if (onSubTabChange) onSubTabChange('inbox'); }}
          onNavigateToSubscriptions={() => { if (onSubTabChange) onSubTabChange('subscriptions'); }}
        />
      )}

      {/* SUB-TAB 2: WORKFLOW INBOX (Product Manager, AI for AD) */}
      {currentSubTab === 'inbox' && (
        <AdPmWorkflowInbox
          onInspectLevel6={() => {
            setTargetDrillDownLevel(6);
            if (onSubTabChange) onSubTabChange('persona');
          }}
        />
      )}

      {/* SUB-TAB 3: MODEL CATALOGUE (Product Manager, AI for AD) */}
      {currentSubTab === 'models' && (
        <AdModelCatalogue />
      )}

      {/* SUB-TAB 4: AGENT & WORKFLOW CATALOGUE (Product Manager, AI for AD) */}
      {currentSubTab === 'agents' && (
        <AdAgentWorkflowCatalogue
          onNavigateToInbox={() => { if (onSubTabChange) onSubTabChange('inbox'); }}
          onNavigateToTrace={() => {
            setTargetDrillDownLevel(6);
            if (onSubTabChange) onSubTabChange('persona');
          }}
        />
      )}

      {/* SUB-TAB 7: AI HARNESS (F3) */}
      {currentSubTab === 'harness' && (
        <AdAgentHarness />
      )}

      {/* SUB-TAB 8: EVALUATION CENTER (F5) */}
      {currentSubTab === 'evaluation' && (
        <AdAgentEvaluation />
      )}

      {/* SUB-TAB 9: GOVERNANCE CENTER (F4) */}
      {currentSubTab === 'governance' && (
        <AdAgentGovernance />
      )}

      {/* SUB-TAB 5: AI TOOLS CATALOGUE (Product Manager, AI for AD) */}
      {currentSubTab === 'tools' && (
        <AdAiToolsCatalogue />
      )}

      {/* SUB-TAB 6: MY SUBSCRIPTIONS (Product Manager, AI for AD) */}
      {currentSubTab === 'subscriptions' && (
        <AdMySubscriptions />
      )}
    </div>
  );
}
