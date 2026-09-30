import React, { useState } from 'react';
import AdPersonaDashboard from './AdPersonaDashboard';
import AdPmWorkflowInbox from './AdPmWorkflowInbox';
import AdModelCatalogue from './AdModelCatalogue';
import AdAgentWorkflowCatalogue from './AdAgentWorkflowCatalogue';
import AdAiToolsCatalogue from './AdAiToolsCatalogue';
import AdMySubscriptions from './AdMySubscriptions';
import { AgentStudioProvider } from '../agent-studio/AgentStudioContext';
import AdAgentHarness from '../agent-studio/pages/AdAgentHarness';
import AdAgentEvaluation from '../agent-studio/pages/AdAgentEvaluation';
import AdAgentGovernance from '../agent-studio/pages/AdAgentGovernance';
import AdKnowledgeFabricPage from '../knowledge-fabric/AdKnowledgeFabricPage';
import '../adPersonaDashboard.css';

/**
 * AI Experience Zone — AI for AD (Automated Driving)
 * Peer-Level Sub-Tabs Architecture for PRD Section 5
 * Navigation is controlled via the Sidebar.
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
  const [localSubTab, setLocalSubTab] = useState(activeSubTab || 'persona');
  const currentSubTab = activeSubTab || localSubTab;
  const [targetDrillDownLevel, setTargetDrillDownLevel] = useState(null);

  const handleSubTabChange = (tabId) => {
    setLocalSubTab(tabId);
    if (onSubTabChange) onSubTabChange(tabId);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      {/* SUB-TAB 1: PERSONA DASHBOARD (Fully Implemented) */}
      {currentSubTab === 'persona' && (
        <AdPersonaDashboard
          initialLevel={targetDrillDownLevel}
          onNavigateToInbox={() => { handleSubTabChange('inbox'); }}
          onNavigateToSubscriptions={() => { handleSubTabChange('subscriptions'); }}
        />
      )}

      {/* SUB-TAB 2: WORKFLOW INBOX (Product Manager, AI for AD) */}
      {currentSubTab === 'inbox' && (
        <AdPmWorkflowInbox
          onInspectLevel6={() => {
            setTargetDrillDownLevel(6);
            handleSubTabChange('persona');
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
          onNavigateToInbox={() => { handleSubTabChange('inbox'); }}
          onNavigateToTrace={() => {
            setTargetDrillDownLevel(6);
            handleSubTabChange('persona');
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

      {/* SUB-TAB: KNOWLEDGE FABRIC (F8 AD ARCHITECTURE) */}
      {currentSubTab === 'knowledge' && (
        <AdKnowledgeFabricPage />
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
