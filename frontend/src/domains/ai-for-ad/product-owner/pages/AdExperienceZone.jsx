import React, { useState } from 'react';
import {
  Sliders,
  Cpu,
  Bot,
  Wrench,
  BookmarkCheck,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Inbox
} from 'lucide-react';
import AdPersonaDashboard from './AdPersonaDashboard';
import AdPmWorkflowInbox from './AdPmWorkflowInbox';
import AdModelCatalogue from './AdModelCatalogue';
import AdAgentWorkflowCatalogue from './AdAgentWorkflowCatalogue';
import AdAiToolsCatalogue from './AdAiToolsCatalogue';
import AdMySubscriptions from './AdMySubscriptions';
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
 */
export default function AdExperienceZone({ onNavigateToInbox }) {
  const [activeSubTab, setActiveSubTab] = useState('persona');
  const [targetDrillDownLevel, setTargetDrillDownLevel] = useState(null);

  const SUB_TABS = [
    { id: 'persona', label: 'Persona Dashboard', icon: Sliders },
    { id: 'inbox', label: 'Workflow Inbox', icon: Inbox, badge: '9' },
    { id: 'models', label: 'Model Catalogue', icon: Cpu, badge: '8' },
    { id: 'agents', label: 'Agent & Workflow Catalogue', icon: Bot, badge: '8' },
    { id: 'tools', label: 'AI Tools Catalogue', icon: Wrench, badge: '23' },
    { id: 'subscriptions', label: 'My Subscriptions', icon: BookmarkCheck, badge: '20' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Sub-Tabs Navigation Track */}
      <nav className="ad-exp-subtab-bar" aria-label="AI Experience Zone Subcategories">
        {SUB_TABS.map((tab) => {
          const isActive = activeSubTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`ad-exp-subtab-btn ${isActive ? 'active' : ''}`}
            >
              <Icon size={14} style={{ opacity: isActive ? 1 : 0.7 }} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="ad-exp-subtab-badge">{tab.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* SUB-TAB 1: PERSONA DASHBOARD (Fully Implemented) */}
      {activeSubTab === 'persona' && (
        <AdPersonaDashboard
          initialLevel={targetDrillDownLevel}
          onNavigateToInbox={() => setActiveSubTab('inbox')}
          onNavigateToSubscriptions={() => setActiveSubTab('subscriptions')}
        />
      )}

      {/* SUB-TAB 2: WORKFLOW INBOX (Product Manager, AI for AD) */}
      {activeSubTab === 'inbox' && (
        <AdPmWorkflowInbox
          onInspectLevel6={() => {
            setTargetDrillDownLevel(6);
            setActiveSubTab('persona');
          }}
        />
      )}

      {/* SUB-TAB 3: MODEL CATALOGUE (Product Manager, AI for AD) */}
      {activeSubTab === 'models' && (
        <AdModelCatalogue />
      )}

      {/* SUB-TAB 4: AGENT & WORKFLOW CATALOGUE (Product Manager, AI for AD) */}
      {activeSubTab === 'agents' && (
        <AdAgentWorkflowCatalogue
          onNavigateToInbox={() => setActiveSubTab('inbox')}
          onNavigateToTrace={() => {
            setTargetDrillDownLevel(6);
            setActiveSubTab('persona');
          }}
        />
      )}

      {/* SUB-TAB 5: AI TOOLS CATALOGUE (Product Manager, AI for AD) */}
      {activeSubTab === 'tools' && (
        <AdAiToolsCatalogue />
      )}

      {/* SUB-TAB 6: MY SUBSCRIPTIONS (Product Manager, AI for AD) */}
      {activeSubTab === 'subscriptions' && (
        <AdMySubscriptions />
      )}
    </div>
  );
}
