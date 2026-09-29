import React, { useState } from 'react';
import { ChevronDown, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { CustomSelect, DOMAIN_OPTIONS, DOMAIN_ROLE_MAP } from './WorkspaceBar';
import { MAIN_PAGES, EXPERIENCE_SUBPAGES, INBOX_COUNTS } from './navConfig';
import './sidebar.css';

/**
 * Sidebar — the app's single navigation surface.
 * Holds the workspace filters (domain, role), the main pages and the
 * AI Experience Zone sub-pages for the active domain.
 */
export default function Sidebar({
  selectedDomain, onDomainChange,
  selectedRole, onRoleChange,
  allowedDomains = [], allowedRoles = [],
  activeTab, onTabChange,
  activeSubTab, onSubTabChange,
  collapsed, onToggleCollapsed
}) {
  const [experienceOpen, setExperienceOpen] = useState(true);

  const availableDomains = DOMAIN_OPTIONS.filter(opt => allowedDomains.includes(opt.value));
  const displayDomains = availableDomains.length > 0 ? availableDomains : DOMAIN_OPTIONS;
  // Roles specifically for the selected domain
  const domainRoles = DOMAIN_ROLE_MAP[selectedDomain] || [];
  const availableDomainRoles = domainRoles.filter(opt => allowedRoles.includes(opt.value));
  const displayRoles = availableDomainRoles.length > 0 ? availableDomainRoles : domainRoles;

  const DomainIcon = DOMAIN_OPTIONS.find(d => d.value === selectedDomain)?.icon;
  const subPages = EXPERIENCE_SUBPAGES[selectedDomain] || [];

  const handleMainClick = (id) => {
    if (id === 'experience') {
      if (activeTab === 'experience') {
        setExperienceOpen(!experienceOpen);
        return;
      }
      setExperienceOpen(true);
    }
    onTabChange(id);
  };

  return (
    <aside className={`hub-sidebar ${collapsed ? 'collapsed' : ''}`} aria-label="Main navigation">
      {/* ── Workspace filters ── */}
      <div className="hub-sidebar-section">
        {!collapsed && <div className="hub-sidebar-heading">Workspace</div>}
        {collapsed ? (
          <button
            className="hub-sidebar-item"
            title={`${selectedDomain} • ${selectedRole} (expand to change)`}
            onClick={onToggleCollapsed}
          >
            {DomainIcon && <DomainIcon size={18} />}
          </button>
        ) : (
          <div className="hub-sidebar-filters">
            <CustomSelect label="Domain" value={selectedDomain} onChange={onDomainChange} options={displayDomains} minWidth="0" fullWidth />
            <CustomSelect label="Role" value={selectedRole} onChange={onRoleChange} options={displayRoles} minWidth="0" fullWidth />
          </div>
        )}
      </div>

      {/* ── Pages ── */}
      <nav className="hub-sidebar-section hub-sidebar-nav">
        {!collapsed && <div className="hub-sidebar-heading">Navigate</div>}
        {MAIN_PAGES.map((page) => {
          const Icon = page.icon;
          const isActive = activeTab === page.id;
          const isExperience = page.id === 'experience';
          const badge = page.id === 'inbox' ? INBOX_COUNTS[selectedDomain] : null;

          return (
            <React.Fragment key={page.id}>
              <button
                id={`nav-tab-${page.id}`}
                className={`hub-sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => handleMainClick(page.id)}
                title={collapsed ? page.label : undefined}
                aria-current={isActive && !isExperience ? 'page' : undefined}
              >
                <Icon size={18} />
                {!collapsed && <span className="hub-sidebar-label">{page.label}</span>}
                {!collapsed && badge != null && <span className="hub-sidebar-badge">{badge}</span>}
                {!collapsed && isExperience && (
                  <ChevronDown size={15} className="hub-sidebar-chevron" style={{ transform: experienceOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }} />
                )}
                {collapsed && badge != null && <span className="hub-sidebar-dot" />}
              </button>

              {isExperience && experienceOpen && (
                <div className={`hub-sidebar-sub ${collapsed ? 'collapsed' : ''}`}>
                  {subPages.map((sub) => {
                    const SubIcon = sub.icon;
                    const subActive = activeTab === 'experience' && activeSubTab === sub.id;
                    return (
                      <button
                        key={sub.id}
                        className={`hub-sidebar-subitem ${subActive ? 'active' : ''}`}
                        onClick={() => { onTabChange('experience'); onSubTabChange(sub.id); }}
                        title={collapsed ? sub.label : undefined}
                        aria-current={subActive ? 'page' : undefined}
                      >
                        <SubIcon size={collapsed ? 16 : 15} />
                        {!collapsed && <span className="hub-sidebar-label">{sub.label}</span>}
                        {!collapsed && sub.badge && <span className="hub-sidebar-badge subtle">{sub.badge}</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* ── Collapse toggle ── */}
      <div className="hub-sidebar-footer">
        <button className="hub-sidebar-item" onClick={onToggleCollapsed} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          {!collapsed && <span className="hub-sidebar-label">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
