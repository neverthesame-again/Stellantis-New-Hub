import React from 'react';
import ProductOwnerRole from './product-owner/index.jsx';

/**
 * AI for AD (Automated Development / Autonomous Driving) Domain Router
 * Multi-Role Domain Architecture:
 * - Product Owner (Carl Weber) -> ./product-owner/
 * - Extensible for future roles (Lead Architect, Safety Engineer, Software Engineer)
 * 
 * Strict Domain Isolation Boundary:
 * Mounts strictly below NavigationTabs based on activeTab and selectedRole.
 */
export default function AiForAdDomain({ activeTab = 'dashboard', onTabChange, selectedRole = 'Product Owner' }) {
  // Role-based domain dispatching
  switch (selectedRole) {
    case 'Product Owner':
    default:
      return (
        <ProductOwnerRole
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      );
  }
}

export { ProductOwnerRole };
