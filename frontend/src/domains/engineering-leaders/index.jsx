import React from 'react';
import EngineeringDashboard from './pages/EngineeringDashboard';
import WorkflowInbox from './pages/WorkflowInbox';
import ExperienceZone from './pages/ExperienceZone';

/**
 * Domain Module: Engineering Leaders
 * Persona: Alex - Chief AI Officer / Head of Software Engineering
 * 
 * Strict Domain Isolation Boundary:
 * Mounts strictly below NavigationTabs based on activeTab.
 * Implements Section 5: Common Persona Experience (5.1 - 5.6)
 */
export default function EngineeringLeadersDomain({ activeTab = 'dashboard' }) {
  if (activeTab === 'dashboard') {
    return <EngineeringDashboard />;
  }

  if (activeTab === 'inbox') {
    return <WorkflowInbox />;
  }

  if (activeTab === 'experience') {
    return <ExperienceZone />;
  }

  return <EngineeringDashboard />;
}

