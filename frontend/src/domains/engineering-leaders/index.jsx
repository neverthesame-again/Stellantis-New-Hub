import React from 'react';
import EngineeringDashboard from './pages/EngineeringDashboard';
import WorkflowInbox from './pages/WorkflowInbox';
import ExperienceZone from './pages/ExperienceZone';

/**
 * Domain Module: Engineering Leader
 * Persona: Alex - Chief AI Officer / Head of Software Engineering
 * 
 * Strict Domain Isolation Boundary:
 * Mounts in the main content area based on the sidebar's activeTab.
 * Implements Section 5: Common Persona Experience (5.1 - 5.6)
 */
export default function EngineeringLeadersDomain({ activeTab = 'dashboard', activeSubTab, onSubTabChange }) {
  if (activeTab === 'dashboard') {
    return <EngineeringDashboard />;
  }

  if (activeTab === 'inbox') {
    return <WorkflowInbox />;
  }

  if (activeTab === 'experience') {
    return <ExperienceZone activeSubTab={activeSubTab} onSubTabChange={onSubTabChange} />;
  }

  return <EngineeringDashboard />;
}

