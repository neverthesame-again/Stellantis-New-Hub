import React, { useState, useEffect } from 'react';
import Header from './core/Header';
import WorkspaceBar, { DOMAIN_PERSONA_MAP, DOMAIN_ROLE_MAP } from './core/WorkspaceBar';
import PersonaHero from './core/PersonaHero';
import NavigationTabs from './core/NavigationTabs';

// Domain Modules
import AmsDashboard from './domains/ai-for-ams/pages/AmsDashboard';
import WorkflowInbox from './domains/ai-for-ams/pages/WorkflowInbox';
import ExperienceZone from './domains/ai-for-ams/pages/ExperienceZone';
import EngineeringLeadersDomain from './domains/engineering-leaders/index';
import AiForAdDomain from './domains/ai-for-ad/index';

// Auth
import { AuthProvider, useAuth } from './auth/AuthContext';
import LoginPage from './auth/LoginPage';
import RegisterPage from './auth/RegisterPage';

// ── Inner App — rendered only when user is authenticated
function AuthenticatedApp() {
  const { user, logout } = useAuth();

  const [theme, setTheme] = useState('light');
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem('stellantis_active_tab') || 'dashboard';
  });

  // Parse user's registered domains/roles
  const allowedDomains = user?.domain ? user.domain.split(', ') : ['AI for AMS'];
  const allowedRoles = user?.role ? user.role.split(', ') : ['Head of AMS'];

  const [selectedDomain, setSelectedDomain] = useState(() => {
    const saved = sessionStorage.getItem('stellantis_domain');
    return saved && allowedDomains.includes(saved) ? saved : allowedDomains[0];
  });
  
  const [selectedRole, setSelectedRole] = useState(() => {
    const saved = sessionStorage.getItem('stellantis_role');
    return saved && allowedRoles.includes(saved) ? saved : allowedRoles[0];
  });

  useEffect(() => {
    sessionStorage.setItem('stellantis_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    sessionStorage.setItem('stellantis_domain', selectedDomain);
  }, [selectedDomain]);

  useEffect(() => {
    sessionStorage.setItem('stellantis_role', selectedRole);
  }, [selectedRole]);


  // Toggle theme and update data-theme attribute on document root
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // When domain changes, automatically sync default role
  const handleDomainChange = (domain) => {
    setSelectedDomain(domain);
    setActiveTab('dashboard');
    const persona = DOMAIN_PERSONA_MAP[domain];
    if (persona) {
      // Find the first allowed role that belongs to this domain
      const validRole = allowedRoles.find(r => DOMAIN_ROLE_MAP[domain]?.some(opt => opt.value === r || opt === r));
      if (validRole) {
        setSelectedRole(validRole);
      } else {
        setSelectedRole(persona.role); // Fallback
      }
    }
  };

  const currentPersona = DOMAIN_PERSONA_MAP[selectedDomain] || DOMAIN_PERSONA_MAP['AI for AMS'];

  return (
    <div className="app-container">
      {/* Universal Stellantis Brand Header */}
      <Header
        currentTheme={theme}
        toggleTheme={toggleTheme}
        activePersona={currentPersona}
        onPersonaChange={handleDomainChange}
      />

      <main className="main-content">
        {/* Workspace Active Status & Domain/Role Dropdowns */}
        <WorkspaceBar
          selectedDomain={selectedDomain}
          onDomainChange={handleDomainChange}
          selectedRole={selectedRole}
          onRoleChange={(role) => {
            setSelectedRole(role);
            setActiveTab('dashboard');
          }}
          allowedDomains={allowedDomains}
          allowedRoles={allowedRoles}
        />

        {/* Persona Hero Context Banner & High-Level KPIs */}
        <PersonaHero
          selectedDomain={selectedDomain}
          selectedRole={selectedRole}
        />

        {/* Page Tabs */}
        <NavigationTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          inboxCount={selectedDomain === 'AI for AMS' ? 7 : (selectedDomain === 'AI for AD' ? 9 : 3)}
        />

        {/* DOMAIN ROUTING WITH BOUNDARY ISOLATION */}
        {selectedDomain === 'AI for AMS' && (
          <>
            {activeTab === 'dashboard' && (
              <AmsDashboard
                onNavigateToInbox={() => setActiveTab('inbox')}
                onNavigateToExperience={() => setActiveTab('experience')}
              />
            )}
            {activeTab === 'inbox' && <WorkflowInbox />}
            {activeTab === 'experience' && <ExperienceZone />}
          </>
        )}

        {selectedDomain === 'Engineering leaders' && (
          <EngineeringLeadersDomain activeTab={activeTab} />
        )}

        {selectedDomain === 'AI for AD' && (
          <AiForAdDomain activeTab={activeTab} onTabChange={setActiveTab} selectedRole={selectedRole} />
        )}
      </main>
    </div>
  );
}

// ── Auth Gate ──
function AuthGate() {
  const { user, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading platform...</div>;
  }

  if (!user) {
    if (showRegister) {
      return <RegisterPage onNavigateToLogin={() => setShowRegister(false)} />;
    }
    return <LoginPage onNavigateToRegister={() => setShowRegister(true)} />;
  }

  return <AuthenticatedApp />;
}

// ── Main App Export ──
export default function App() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}
