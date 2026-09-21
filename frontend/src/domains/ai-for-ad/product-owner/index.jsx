import React from 'react';
import AdDashboard from './pages/AdDashboard';
import AdWorkflowInbox from './pages/AdWorkflowInbox';
import AdExperienceZone from './pages/AdExperienceZone';

/**
 * Product Owner Domain Module
 * Persona: Product Owner (Carl Weber)
 * Domain: AI for AD (Automated Driving)
 * 
 * Strict Role Isolation Boundary:
 * Mounts tab components (dashboard, inbox, experience) for the Product Owner role.
 */
export default function ProductOwnerRole({ activeTab = 'dashboard', onTabChange }) {
  if (activeTab === 'dashboard') {
    return <AdDashboard onNavigateToInbox={() => onTabChange && onTabChange('inbox')} />;
  }

  if (activeTab === 'inbox') {
    return <AdWorkflowInbox />;
  }

  if (activeTab === 'experience') {
    return <AdExperienceZone onNavigateToInbox={() => onTabChange && onTabChange('inbox')} />;
  }

  return <AdDashboard onNavigateToInbox={() => onTabChange && onTabChange('inbox')} />;
}
