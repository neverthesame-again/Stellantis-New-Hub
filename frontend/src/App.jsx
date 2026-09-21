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

const domainForRole = (role) =>
  Object.keys(DOMAIN_ROLE_MAP).find(d => DOMAIN_ROLE_MAP[d].some(opt => opt.value === role));

// ── Inner App — rendered only when user is authenticated
function AuthenticatedApp() {
  const { user, logout } = useAuth();

  const [theme, setTheme] = useState('light');
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem('aihub_active_tab') || 'dashboard';
  });

  // Parse user's registered domains/roles
  // (profiles registered before the rename still say "Engineering leaders")
  const allowedDomains = user?.domain
    ? user.domain.split(', ').map(d => (d === 'Engineering leaders' ? 'Engineering leader' : d))
    : ['AI for AMS'];
  const allowedRoles = user?.role ? user.role.split(', ') : ['Head of AMS'];

  const [selectedDomain, setSelectedDomain] = useState(() => {
    const saved = sessionStorage.getItem('aihub_domain');
    return saved && allowedDomains.includes(saved) ? saved : allowedDomains[0];
  });
  
  const [selectedRole, setSelectedRole] = useState(() => {
    const saved = sessionStorage.getItem('aihub_role');
    if (saved && allowedRoles.includes(saved) && domainForRole(saved) === selectedDomain) return saved;
    // Otherwise the first allowed role that belongs to the selected domain
    return allowedRoles.find(r => domainForRole(r) === selectedDomain) || allowedRoles[0];
  });

  useEffect(() => {
    sessionStorage.setItem('aihub_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    sessionStorage.setItem('aihub_domain', selectedDomain);
  }, [selectedDomain]);

  useEffect(() => {
    sessionStorage.setItem('aihub_role', selectedRole);
  }, [selectedRole]);

  // AI Experience Zone sub-page, driven by the sidebar
  const [storedSubTab, setActiveSubTab] = useState(() => {
    return sessionStorage.getItem('aihub_sub_tab') || defaultSubPage(selectedDomain);
  });

  // Fall back to the domain's first sub-page if the stored one doesn't exist there
  const activeSubTab = (EXPERIENCE_SUBPAGES[selectedDomain] || []).some(p => p.id === storedSubTab)
    ? storedSubTab
    : defaultSubPage(selectedDomain);

  useEffect(() => {
    sessionStorage.setItem('aihub_sub_tab', activeSubTab);
  }, [activeSubTab]);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem('aihub_sidebar_collapsed');
      if (saved !== null) return saved === 'true';
    } catch {}
    // Start as an icon rail on narrow screens
    return window.innerWidth < 900;
  });

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => {
      try { localStorage.setItem('aihub_sidebar_collapsed', String(!prev)); } catch {}
      return !prev;
    });
  };


  // Toggle theme and update data-theme attribute on document root
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Selecting a role switches to the domain that role belongs to
  const handleRoleChange = (role) => {
    const domain = domainForRole(role);
    if (domain && domain !== selectedDomain) {
      setSelectedDomain(domain);
      setActiveSubTab(defaultSubPage(domain));
    }
    setSelectedRole(role);
    setActiveTab('dashboard');
  };

  // When domain changes, automatically sync default role
  const handleDomainChange = (domain) => {
    setSelectedDomain(domain);
    setActiveTab('dashboard');
    setActiveSubTab(defaultSubPage(domain));
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
      {/* Universal Brand Header */}
      <Header
        currentTheme={theme}
        toggleTheme={toggleTheme}
        activePersona={currentPersona}
        onPersonaChange={handleDomainChange}
      />

      <div className="app-body">
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
                  onNavigateToInbox={() => setActiveTab('inbox')}
                  onNavigateToExperience={() => setActiveTab('experience')}
                />
              )}
              {activeTab === 'inbox' && <WorkflowInbox />}
              {activeTab === 'experience' && (
                <ExperienceZone activeSubTab={activeSubTab} onSubTabChange={setActiveSubTab} />
              )}
            </>
          )}

          {selectedDomain === 'Engineering leader' && (
            <EngineeringLeadersDomain activeTab={activeTab} activeSubTab={activeSubTab} onSubTabChange={setActiveSubTab} />
          )}

          {selectedDomain === 'AI for AD' && (
            <AiForAdDomain activeTab={activeTab} onTabChange={setActiveTab} selectedRole={selectedRole} activeSubTab={activeSubTab} onSubTabChange={setActiveSubTab} />
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
