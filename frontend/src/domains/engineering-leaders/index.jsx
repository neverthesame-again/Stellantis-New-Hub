import React from 'react';
import EngineeringDashboard from './pages/EngineeringDashboard';
import WorkflowInbox from './pages/WorkflowInbox';
import ExperienceZone from './pages/ExperienceZone';
import EngineeringFinOps from './pages/EngineeringFinOps';
import EngineeringGovernance from './pages/EngineeringGovernance';

/**
 * Domain Module: Engineering Leaders
 * Persona: Alex - Chief AI Officer / Head of Software Engineering
 * 
 * Strict Domain Isolation Boundary:
 * Mounts strictly below NavigationTabs based on activeTab.
 * Implements Section 5: Common Persona Experience (5.1 - 5.6) + FinOps (FR-401-405) + Risk & Governance (8.4)
 */
export default function EngineeringLeadersDomain({
  activeTab = 'dashboard',
  activeSubTab = 'persona',
  experienceSubTab,
  onSubTabChange,
  drillDownLevel = 1,
  contextPortfolio,
  contextProject
}) {
  const currentSubTab = activeSubTab || experienceSubTab || 'persona';

  if (activeTab === 'dashboard') {
    return <EngineeringDashboard />;
  }

  if (activeTab === 'inbox') {
    return <WorkflowInbox />;
  }

  if (activeTab === 'experience') {
    return (
      <ExperienceZone
        activeSubTab={currentSubTab}
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

  return <EngineeringDashboard />;
}

