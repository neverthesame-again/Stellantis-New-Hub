import React from 'react';
import EngineeringDashboard from './pages/EngineeringDashboard';
import WorkflowInbox from './pages/WorkflowInbox';
import ExperienceZone from './pages/ExperienceZone';
import EngineeringFinOps from './pages/EngineeringFinOps';
import EngineeringGovernance from './pages/EngineeringGovernance';

/**
 * Domain Module: Engineering Leader
 * Persona: Alex - Chief AI Officer / Head of Software Engineering
 * 
 * Strict Domain Isolation Boundary:
 * Mounts strictly below NavigationTabs based on activeTab.
 * Implements Section 5: Common Persona Experience (5.1 - 5.6) + FinOps (FR-401-405) + Risk & Governance (8.4)
 */
export default function EngineeringLeaderDomain({
  activeTab = 'dashboard',
  activeSubTab = 'finops',
  experienceSubTab,
  onSubTabChange,
  drillDownLevel = 1,
  contextPortfolio,
  contextProject
}) {
  const currentSubTab = activeSubTab || experienceSubTab || 'finops';
  const resolvedSubTab = (currentSubTab === 'persona' || currentSubTab === 'inbox') ? 'finops' : currentSubTab;

  if (activeTab === 'dashboard') {
    return <EngineeringDashboard />;
  }

  if (activeTab === 'inbox') {
    return <WorkflowInbox />;
  }

  if (activeTab === 'experience') {
    return (
      <ExperienceZone
        activeSubTab={resolvedSubTab}
        onSubTabChange={onSubTabChange}
        drillDownLevel={drillDownLevel}
        contextPortfolio={contextPortfolio}
        contextProject={contextProject}
      />
    );
  }

  if (activeTab === 'finops') {
    return (
      <ExperienceZone
        activeSubTab="finops"
        onSubTabChange={onSubTabChange}
        drillDownLevel={drillDownLevel}
        contextPortfolio={contextPortfolio}
        contextProject={contextProject}
      />
    );
  }

  if (activeTab === 'governance') {
    return (
      <ExperienceZone
        activeSubTab="governance"
        onSubTabChange={onSubTabChange}
        drillDownLevel={drillDownLevel}
        contextPortfolio={contextPortfolio}
        contextProject={contextProject}
      />
    );
  }

  if (activeTab === 'knowledge') {
    return (
      <ExperienceZone
        activeSubTab="knowledge"
        onSubTabChange={onSubTabChange}
        drillDownLevel={drillDownLevel}
        contextPortfolio={contextPortfolio}
        contextProject={contextProject}
      />
    );
  }

  return <EngineeringDashboard />;
}

