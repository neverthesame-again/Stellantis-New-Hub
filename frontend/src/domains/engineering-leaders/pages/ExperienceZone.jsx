import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Inbox,
  Cpu,
  Bot,
  Wrench,
  BookmarkCheck,
  CheckCircle2
} from 'lucide-react';
import EngineeringPersonaDashboard from './EngineeringPersonaDashboard';
import EngineeringExpInbox from './EngineeringExpInbox';
import EngineeringModelCatalogue from './EngineeringModelCatalogue';
import EngineeringAgentCatalogue from './EngineeringAgentCatalogue';
import EngineeringToolsCatalogue from './EngineeringToolsCatalogue';
import EngineeringSubscriptions from './EngineeringSubscriptions';
import { engineeringExperienceData } from '../mockData.js';
import '../engineeringExperience.css';

/**
 * AI Experience Zone — Engineering Leaders
 * Persona: Alex — Chief AI Officer / Head of Software Engineering
 * Peer-Level Sub-Tabs Architecture for PRD Section 5 (5.1 - 5.6)
 * 
 * Sub-Tabs:
 * 1. 5.1 Persona Dashboard (Master Cockpit & 6-Level Operational Depth Pipeline)
 * 2. 5.2 Workflow Inbox (Executive Governance Decision Console — PRD §5.2 Dedicated)
 * 3. 5.3 Model Catalogue (8 Enterprise Foundation Models & Side-by-Side Comparisons)
 * 4. 5.4 Agent & Workflow Catalogue (8 Registered Autonomous Automotive Agents)
 * 5. 5.5 AI Tools Catalogue (10 Engineering Disciplines & Integration Specs)
 * 6. 5.6 My Subscriptions (Consolidated Subscriptions across 5 Grant Levels & 8 Entity Types)
 */
export default function ExperienceZone() {
  const [data, setData] = useState(engineeringExperienceData);
  const [activeSubTab, setActiveSubTab] = useState('persona');
  const [targetDrillDownLevel, setTargetDrillDownLevel] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (text) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Fetch backend data if available, fallback gracefully to mockData
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/engineering/experience`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setData(json.data);
        }
      })
      .catch((err) => {
        console.log('Backend not reached, using local engineering experience data', err);
      });
  }, []);

  // Peer-Level Sub-Tabs matching PRD Section 5
  const SUB_TABS = [
    { id: 'persona', label: 'Persona Dashboard', icon: Sliders, badge: '9' },
    { id: 'inbox', label: 'Workflow Inbox', icon: Inbox, badge: '7' },
    { id: 'models', label: 'Model Catalogue', icon: Cpu, badge: '8' },
    { id: 'agents', label: 'Agent & Workflows', icon: Bot, badge: '8', title: 'Agent and Agentic Workflow Catalogue' },
    { id: 'tools', label: 'AI Tools Catalogue', icon: Wrench, badge: '10' },
    { id: 'subscriptions', label: 'My Subscriptions', icon: BookmarkCheck, badge: `${data?.mySubscriptions?.length || 14}` },
  ];

  // Model Subscription Toggle
  const handleToggleModelSubscription = async (modelId) => {
    const target = data.models.find(m => m.id === modelId);
    if (!target) return;

    const nextSubscribed = !target.subscribed;
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/engineering/experience/models/${modelId}/subscription`, {
        method: 'POST'
      });
    } catch (e) {}

    setData(prev => {
      const updatedModels = prev.models.map(m => m.id === modelId ? { ...m, subscribed: nextSubscribed } : m);
      let updatedSubs = [...prev.mySubscriptions];

      if (nextSubscribed) {
        if (!updatedSubs.some(s => s.entityName.includes(target.name))) {
          updatedSubs.unshift({
            id: `SUB-${Date.now().toString().slice(-4)}`,
            entityName: `${target.name} (${target.deploymentType.split(' ')[0]})`,
            type: "Model",
            level: "Portfolio level",
            monthlyUsage: "0 tokens (New)",
            costAllocation: target.costAllocation,
            grantedBy: "Alex (CAIO Self-Service)",
            renewalDate: "2027-03-31",
            status: "Active"
          });
        }
        showToast(`Subscribed "${target.name}" to CAIO Executive Portfolio`);
      } else {
        updatedSubs = updatedSubs.filter(s => !s.entityName.includes(target.name));
        showToast(`Unsubscribed "${target.name}" from Portfolio`);
      }

      return {
        ...prev,
        models: updatedModels,
        mySubscriptions: updatedSubs
      };
    });
  };

  // Model Onboarding Submission
  const handleOnboardModel = async (formData) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/engineering/experience/models/onboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const resData = await res.json();
      if (resData.success && resData.data) {
        setData(prev => ({
          ...prev,
          models: [resData.data, ...prev.models]
        }));
      }
    } catch (e) {
      const fallbackNew = {
        id: `MOD-ONB-${Date.now().toString().slice(-4)}`,
        name: formData.name,
        version: "v1.0-RC",
        provider: formData.provider,
        capability: formData.capability,
        modality: "Text & Code",
        deploymentType: formData.deploymentType,
        costPerMillionTokens: "$0.45 in / $0.90 out",
        latencyMs: 240,
        riskRating: formData.riskRating,
        contextWindow: "64k tokens",
        supportedUseCases: ["Custom Engineering Synthesis"],
        benchmarkResults: { humanEval: "87.0%", sweBench: "36.5%", autosarCompliantRate: "93.0%", latencyP95: "260ms" },
        limitations: "Under active CAIO sandbox evaluation.",
        approvedUseCases: "Internal exploratory prototyping.",
        dataRestrictions: "VPC Air-gapped boundary.",
        usagePolicies: "Fast-tracked by CAIO.",
        subscribed: true,
        monthlyConsumptionTokens: "0",
        costAllocation: "$1,200 / mo"
      };
      setData(prev => ({
        ...prev,
        models: [fallbackNew, ...prev.models]
      }));
    }
  };

  // Agent Subscription Toggle
  const handleSubscribeAgent = async (agentId, projectName = 'STLA Large SDV Platform Phase 2', explicitState) => {
    const targetAgent = (data?.agents || []).find(a => a.id === agentId) || (engineeringExperienceData?.agents || []).find(a => a.id === agentId);
    if (!targetAgent) return;

    const nextSubscribed = explicitState !== undefined ? explicitState : !targetAgent.subscribed;

    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/engineering/experience/agents/${agentId}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName, subscribed: nextSubscribed, permissionTier: 'Project Level' })
      });
    } catch (e) {}

    setData(prev => {
      const currentProjects = targetAgent.subscribedProjects || [];
      let updatedProjects = [...currentProjects];
      if (nextSubscribed) {
        if (!updatedProjects.includes(projectName)) updatedProjects.push(projectName);
      } else {
        updatedProjects = updatedProjects.filter(p => p !== projectName);
      }

      let updatedSubs = [...(prev.mySubscriptions || [])];
      if (nextSubscribed) {
        if (!updatedSubs.some(s => s.entityName.includes(targetAgent.name))) {
          updatedSubs.unshift({
            id: `SUB-AGT-${Date.now().toString().slice(-4)}`,
            entityName: `${targetAgent.name} (${projectName.split(' ')[0]})`,
            type: "Agent",
            level: "Project level",
            monthlyUsage: "12,000 tasks/mo",
            costAllocation: "$4,500 / mo",
            grantedBy: "Alex (CAIO)",
            renewalDate: "2027-01-15",
            status: "Active"
          });
        }
      } else {
        updatedSubs = updatedSubs.filter(s => !s.entityName.includes(targetAgent.name));
      }

      return {
        ...prev,
        agents: (prev.agents || []).map(a => a.id === agentId ? {
          ...a,
          subscribed: nextSubscribed,
          subscribedProjects: updatedProjects,
          subscribedToProject: nextSubscribed ? projectName : (a.subscribedToProject || projectName)
        } : a),
        mySubscriptions: updatedSubs
      };
    });
  };

  // Tool Subscription Toggle
  const handleToggleSubscribeTool = async (toolId) => {
    const targetTool = data.tools.find(t => t.id === toolId);
    if (!targetTool) return;

    const nextSubscribed = !targetTool.subscribed;
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/engineering/experience/tools/${toolId}/subscribe`, {
        method: 'POST'
      });
    } catch (e) {}

    setData(prev => {
      const updatedTools = prev.tools.map(t => t.id === toolId ? { ...t, subscribed: nextSubscribed } : t);
      let updatedSubs = [...prev.mySubscriptions];

      if (nextSubscribed) {
        if (!updatedSubs.some(s => s.entityName.includes(targetTool.name))) {
          updatedSubs.unshift({
            id: `SUB-TOOL-${Date.now().toString().slice(-4)}`,
            entityName: `${targetTool.name} (Enterprise Cluster)`,
            type: "Tool",
            level: "Enterprise level",
            monthlyUsage: "48 squad seats",
            costAllocation: targetTool.costAllocation,
            grantedBy: "Alex (CAIO Enterprise License)",
            renewalDate: "2027-06-30",
            status: "Active"
          });
        }
      } else {
        updatedSubs = updatedSubs.filter(s => !s.entityName.includes(targetTool.name));
      }

      return {
        ...prev,
        tools: updatedTools,
        mySubscriptions: updatedSubs
      };
    });
  };

  // Subscription Action (Renew, Cancel)
  const handleSubscriptionAction = async (subId, actionType) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/engineering/experience/subscriptions/${subId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: actionType })
      });
    } catch (e) {}

    setData(prev => {
      if (actionType === 'cancel') {
        return {
          ...prev,
          mySubscriptions: prev.mySubscriptions.filter(s => s.id !== subId)
        };
      }
      if (actionType === 'renew') {
        return {
          ...prev,
          mySubscriptions: prev.mySubscriptions.map(s => s.id === subId ? { ...s, renewalDate: "2027-12-31", status: "Active" } : s)
        };
      }
      return prev;
    });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          background: 'var(--badge-success-bg)',
          color: 'var(--badge-success-text)',
          border: '1px solid var(--badge-success-border)',
          borderRadius: '8px',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.875rem',
          fontWeight: 600,
          boxShadow: 'var(--shadow-md)'
        }}>
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* PEER-LEVEL SUB-TABS NAVIGATION BAR (Matches AI for AD Master Architecture) */}
      <nav className="eng-exp-subtab-bar" aria-label="AI Experience Zone Subcategories">
        {SUB_TABS.map((tab) => {
          const isActive = activeSubTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`eng-exp-subtab-btn ${isActive ? 'active' : ''}`}
              title={tab.title || tab.label}
            >
              <Icon size={14} style={{ opacity: isActive ? 1 : 0.7, flexShrink: 0 }} />
              <span className="eng-exp-subtab-text">{tab.label}</span>
              {tab.badge && (
                <span className="eng-exp-subtab-badge">{tab.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* =========================================================
          SUB-TAB 1: 5.1 PERSONA DASHBOARD (Master Cockpit & 6-Level Pipeline)
          ========================================================= */}
      {activeSubTab === 'persona' && (
        <EngineeringPersonaDashboard
          initialLevel={targetDrillDownLevel}
          onNavigateToInbox={() => setActiveSubTab('inbox')}
          onNavigateToSubscriptions={() => setActiveSubTab('subscriptions')}
        />
      )}

      {/* =========================================================
          SUB-TAB 2: 5.2 WORKFLOW INBOX (Dedicated Experience Zone Console)
          ========================================================= */}
      {activeSubTab === 'inbox' && (
        <EngineeringExpInbox
          onInspectLevel6={() => {
            setTargetDrillDownLevel(6);
            setActiveSubTab('persona');
          }}
        />
      )}

      {/* =========================================================
          SUB-TAB 3: 5.3 MODEL CATALOGUE (8 Enterprise Models & Comparisons)
          ========================================================= */}
      {activeSubTab === 'models' && (
        <EngineeringModelCatalogue
          models={data.models}
          onToggleSubscription={handleToggleModelSubscription}
          onOnboardModel={handleOnboardModel}
          showToast={showToast}
        />
      )}

      {/* =========================================================
          SUB-TAB 4: 5.4 AGENT AND AGENTIC WORKFLOW CATALOGUE (8 Registered Agents)
          ========================================================= */}
      {activeSubTab === 'agents' && (
        <EngineeringAgentCatalogue
          agents={data?.agents || engineeringExperienceData.agents}
          onSubscribeAgent={handleSubscribeAgent}
          onInspectTrace={() => {
            setTargetDrillDownLevel(6);
            setActiveSubTab('persona');
          }}
          showToast={showToast}
        />
      )}

      {/* =========================================================
          SUB-TAB 5: 5.5 AI TOOLS CATALOGUE (10 Lifecycle Disciplines)
          ========================================================= */}
      {activeSubTab === 'tools' && (
        <EngineeringToolsCatalogue
          tools={data?.tools || engineeringExperienceData.tools}
          onToggleSubscribeTool={handleToggleSubscribeTool}
          showToast={showToast}
        />
      )}

      {/* =========================================================
          SUB-TAB 6: 5.6 MY SUBSCRIPTIONS (Consolidated Table across 5 Levels)
          ========================================================= */}
      {activeSubTab === 'subscriptions' && (
        <EngineeringSubscriptions
          subscriptions={data.mySubscriptions}
          onSubscriptionAction={handleSubscriptionAction}
          showToast={showToast}
        />
      )}
    </div>
  );
}
