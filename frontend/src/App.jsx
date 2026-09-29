import React, { useState, useEffect } from 'react';
import Header from './core/Header';
import { DOMAIN_PERSONA_MAP, DOMAIN_ROLE_MAP } from './core/WorkspaceBar';
import PersonaHero from './core/PersonaHero';
import Sidebar from './core/Sidebar';
import { defaultSubPage, EXPERIENCE_SUBPAGES } from './core/navConfig';

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

  const [activeSubTab, setActiveSubTab] = useState(() => {
    return sessionStorage.getItem('stellantis_active_subtab') || defaultSubPage(selectedDomain);
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem('aihub_sidebar_collapsed');
      if (saved !== null) return saved === 'true';
    } catch {}
    return window.innerWidth < 900;
  });

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => {
      try { localStorage.setItem('aihub_sidebar_collapsed', String(!prev)); } catch {}
      return !prev;
    });
  };

  useEffect(() => {
    sessionStorage.setItem('stellantis_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (activeSubTab) {
      sessionStorage.setItem('stellantis_active_subtab', activeSubTab);
    } else {
      sessionStorage.removeItem('stellantis_active_subtab');
    }
  }, [activeSubTab]);

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

  // When domain changes, automatically sync default role and default subpage
  const handleDomainChange = (domain) => {
    setSelectedDomain(domain);
    setActiveTab('dashboard');
    setActiveSubTab(defaultSubPage(domain));
    const persona = DOMAIN_PERSONA_MAP[domain];
    if (persona) {
      const validRole = allowedRoles.find(r => DOMAIN_ROLE_MAP[domain]?.some(opt => opt.value === r || opt === r));
      if (validRole) {
        setSelectedRole(validRole);
      } else {
        setSelectedRole(persona.role);
      }
    }
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setActiveTab('dashboard');
    // If the role belongs to another domain, switch to that domain
    const targetDomain = Object.keys(DOMAIN_ROLE_MAP).find(d => DOMAIN_ROLE_MAP[d]?.some(opt => opt.value === role || opt === role));
    if (targetDomain && targetDomain !== selectedDomain) {
      setSelectedDomain(targetDomain);
      setActiveSubTab(defaultSubPage(targetDomain));
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

      <div className="app-body">
        {/* Left Navigation Sidebar */}
        <Sidebar
          selectedDomain={selectedDomain}
          onDomainChange={handleDomainChange}
          selectedRole={selectedRole}
          onRoleChange={handleRoleChange}
          allowedDomains={allowedDomains}
          allowedRoles={allowedRoles}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeSubTab={activeSubTab}
          onSubTabChange={setActiveSubTab}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={toggleSidebar}
        />

        <main className="main-content">
          {/* Persona Hero Context Banner & High-Level KPIs */}
          <PersonaHero
            selectedDomain={selectedDomain}
            selectedRole={selectedRole}
          />

          {/* DOMAIN ROUTING WITH BOUNDARY ISOLATION */}
          {selectedDomain === 'AI for AMS' && (
            <>
              {activeTab === 'dashboard' && (
                <AmsDashboard
                  onNavigateToInbox={() => { setActiveTab('inbox'); }}
                  onNavigateToExperience={() => { setActiveTab('experience'); setActiveSubTab('models'); }}
                />
              )}
              {activeTab === 'inbox' && <WorkflowInbox />}
              {activeTab === 'experience' && <ExperienceZone activeSubTab={activeSubTab} onSubTabChange={setActiveSubTab} />}
            </>
          )}

          {(selectedDomain === 'Engineering leaders' || selectedDomain === 'Engineering leader') && (
            <EngineeringLeadersDomain activeTab={activeTab} activeSubTab={activeSubTab} onSubTabChange={setActiveSubTab} />
          )}

          {selectedDomain === 'AI for AD' && (
            <AiForAdDomain 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
              selectedRole={selectedRole}
              activeSubTab={activeSubTab}
              onSubTabChange={setActiveSubTab}
            />
          )}
        </main>
      </div>
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
