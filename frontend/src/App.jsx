import React, { useState, useEffect } from 'react';
import Header from './core/Header';
import { DOMAIN_PERSONA_MAP, DOMAIN_ROLE_MAP } from './core/WorkspaceBar';
import PersonaHero from './core/PersonaHero';
import Sidebar from './core/Sidebar';
import { defaultSubPage, EXPERIENCE_SUBPAGES } from './core/navConfig';

// Domain Modules
import AiForAmsDomain from './domains/ai-for-ams/index';
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
    return sessionStorage.getItem('tcs_active_tab') || sessionStorage.getItem('stellantis_active_tab') || 'dashboard';
  });

  // Helper to normalize domain strings
  const normalizeDomainName = (d) => {
    if (!d) return '';
    const trimmed = d.trim();
    if (trimmed.toLowerCase().includes('engineering')) return 'Engineering Leader';
    return trimmed;
  };

  // Parse user's registered domains/roles with normalized domain names
  const allowedDomains = user?.domain
    ? Array.from(new Set(user.domain.split(',').map(d => normalizeDomainName(d)).filter(Boolean)))
    : ['AI for AMS'];
  const allowedRoles = user?.role ? user.role.split(',').map(r => r.trim()).filter(Boolean) : ['Head of AMS'];

  const [selectedDomain, setSelectedDomain] = useState(() => {
    const rawSaved = sessionStorage.getItem('tcs_domain') || sessionStorage.getItem('stellantis_domain');
    const saved = normalizeDomainName(rawSaved);
    return saved && allowedDomains.includes(saved) ? saved : allowedDomains[0];
  });
  
  const [selectedRole, setSelectedRole] = useState(() => {
    const saved = sessionStorage.getItem('tcs_role') || sessionStorage.getItem('stellantis_role');
    const validRolesForDomain = DOMAIN_ROLE_MAP[selectedDomain]?.map(opt => opt.value || opt) || [];
    if (saved && validRolesForDomain.includes(saved) && allowedRoles.includes(saved)) {
      return saved;
    }
    const matchingAllowed = allowedRoles.find(r => validRolesForDomain.includes(r));
    return matchingAllowed || DOMAIN_PERSONA_MAP[selectedDomain]?.role || validRolesForDomain[0] || allowedRoles[0];
  });

  const [activeSubTab, setActiveSubTab] = useState(() => {
    const saved = sessionStorage.getItem('tcs_active_subtab') || sessionStorage.getItem('stellantis_active_subtab');
    if (saved === 'persona' || saved === 'inbox') return defaultSubPage(selectedDomain);
    return saved || defaultSubPage(selectedDomain);
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

  // Ensure selectedRole is always strictly aligned with selectedDomain
  useEffect(() => {
    const validRolesForDomain = DOMAIN_ROLE_MAP[selectedDomain]?.map(opt => opt.value || opt) || [];
    if (validRolesForDomain.length > 0 && !validRolesForDomain.includes(selectedRole)) {
      const fallbackRole = allowedRoles.find(r => validRolesForDomain.includes(r)) || DOMAIN_PERSONA_MAP[selectedDomain]?.role || validRolesForDomain[0];
      if (fallbackRole) {
        setSelectedRole(fallbackRole);
      }
    }
  }, [selectedDomain, selectedRole, allowedRoles]);

  useEffect(() => {
    sessionStorage.setItem('tcs_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (activeSubTab) {
      sessionStorage.setItem('tcs_active_subtab', activeSubTab);
    } else {
      sessionStorage.removeItem('tcs_active_subtab');
    }
  }, [activeSubTab]);

  useEffect(() => {
    sessionStorage.setItem('tcs_domain', selectedDomain);
  }, [selectedDomain]);

  useEffect(() => {
    sessionStorage.setItem('tcs_role', selectedRole);
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
      {/* Universal TCS Brand Header */}
      <Header
        currentTheme={theme}
        toggleTheme={toggleTheme}
        selectedDomain={selectedDomain}
        selectedRole={selectedRole}
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
            <AiForAmsDomain
              activeTab={activeTab}
              onTabChange={setActiveTab}
              activeSubTab={activeSubTab}
              onSubTabChange={setActiveSubTab}
            />
          )}

          {(selectedDomain === 'Engineering Leader' || selectedDomain === 'Engineering leaders' || selectedDomain === 'Engineering leader') && (
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
