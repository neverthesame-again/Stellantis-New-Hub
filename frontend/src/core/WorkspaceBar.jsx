import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronDown, 
  Check, 
  Server, 
  Brain, 
  Layers, 
  User, 
  ShieldCheck, 
  UserCheck 
} from 'lucide-react';

export const DOMAIN_PERSONA_MAP = {
  'AI for AMS': {
    domain: 'AI for AMS',
    role: 'Head of AMS',
    userName: 'Tony',
    avatarLetter: 'T',
    subtitle: 'Operational Resilience Engine, Incident Cluster Analyzer & Problem-to-Change Synthesizer',
    platform: 'AMS-OPS',
    shift: 'EMEA Day Ops | Active',
    shiftProgress: '68%',
    infoChips: [
      { label: '4 Active Clusters', dot: true, dotColor: '#f59e0b', bg: 'var(--badge-high-bg)', border: 'var(--badge-high-border)', color: 'var(--badge-high-text)' },
      { label: '12 Pending Problem Records', dot: false, bg: 'var(--bg-subtle)', border: 'var(--border-color)', color: 'var(--text-primary)' },
      { label: 'Tier-1 Services Healthy', dot: true, dotColor: '#10b981', bg: 'var(--badge-success-bg)', border: 'var(--badge-success-border)', color: 'var(--badge-success-text)' }
    ],
    statusText: 'Enterprise Tier-1 Services active workspace - 4 Active Clusters - 12 Pending Problem Records',
    kpis: [
      { label: 'SLA HEALTH', value: '99.1%', color: 'var(--text-primary)' },
      { label: 'AI RESOLUTION', value: '78%', color: '#10b981' }
    ]
  },
  'Engineering Leader': {
    domain: 'Engineering Leader',
    role: 'Chief AI Officer',
    userName: 'Alex',
    avatarLetter: 'A',
    subtitle: 'Enterprise AI Governance, Architecture Standards & Cross-Portfolio Model Strategy',
    platform: 'ENG-LEAD',
    shift: 'Global Strategy | Active',
    shiftProgress: '85%',
    infoChips: [
      { label: '18 Model Subscriptions', dot: false, bg: 'var(--bg-subtle)', border: 'var(--border-color)', color: 'var(--text-primary)' },
      { label: '6 Architecture Reviews In-Flight', dot: true, dotColor: '#3b82f6', bg: 'var(--badge-info-bg)', border: 'var(--badge-info-border)', color: 'var(--badge-info-text)' },
      { label: 'Global Strategy Active', dot: true, dotColor: '#10b981', bg: 'var(--badge-success-bg)', border: 'var(--badge-success-border)', color: 'var(--badge-success-text)' }
    ],
    statusText: 'Enterprise Engineering Core - 18 Model Subscriptions - 6 Architecture Reviews in Flight',
    kpis: [
      { label: 'GOVERNANCE COMPLIANCE', value: '96.4%', color: 'var(--text-primary)' },
      { label: 'MODEL ADOPTION', value: '84%', color: '#3b82f6' }
    ]
  },
  'Engineering leaders': {
    domain: 'Engineering Leader',
    role: 'Chief AI Officer',
    userName: 'Alex',
    avatarLetter: 'A',
    subtitle: 'Enterprise AI Governance, Architecture Standards & Cross-Portfolio Model Strategy',
    platform: 'ENG-LEAD',
    shift: 'Global Strategy | Active',
    shiftProgress: '85%',
    infoChips: [
      { label: '18 Model Subscriptions', dot: false, bg: 'var(--bg-subtle)', border: 'var(--border-color)', color: 'var(--text-primary)' },
      { label: '6 Architecture Reviews In-Flight', dot: true, dotColor: '#3b82f6', bg: 'var(--badge-info-bg)', border: 'var(--badge-info-border)', color: 'var(--badge-info-text)' },
      { label: 'Global Strategy Active', dot: true, dotColor: '#10b981', bg: 'var(--badge-success-bg)', border: 'var(--badge-success-border)', color: 'var(--badge-success-text)' }
    ],
    statusText: 'Enterprise Engineering Core - 18 Model Subscriptions - 6 Architecture Reviews in Flight',
    kpis: [
      { label: 'GOVERNANCE COMPLIANCE', value: '96.4%', color: 'var(--text-primary)' },
      { label: 'MODEL ADOPTION', value: '84%', color: '#3b82f6' }
    ]
  },
  'AI for AD': {
    domain: 'AI for AD',
    role: 'Product Owner',
    userName: 'Product Owner',
    avatarLetter: 'P',
    subtitle: 'Autonomous Driving Systems (L2+) • Release 4.2 Program • Decision Cockpit',
    platform: 'AD-PO',
    shift: 'Release 4.2 Program | Sprint 42',
    shiftProgress: '88% Readiness',
    infoChips: [
      { label: '3 Critical Gated', dot: true, dotColor: '#ef4444', bg: 'var(--badge-high-bg)', border: 'rgba(239,68,68,0.3)', color: '#ef4444' },
      { label: 'Release 4.2 Program', dot: true, dotColor: '#8b5cf6', bg: 'var(--badge-purple-bg)', border: 'var(--badge-purple-border)', color: 'var(--badge-purple-text)' },
      { label: '20 Subscriptions Active', dot: true, dotColor: '#10b981', bg: 'var(--badge-success-bg)', border: 'var(--badge-success-border)', color: 'var(--badge-success-text)' }
    ],
    statusText: 'Autonomous Driving L2+ Workspace • Release 4.2 Program • 9 Decisions Pending Triage • 20 AI Subscriptions',
    kpis: [
      { label: 'RELEASE READINESS', value: '88%', color: 'var(--text-primary)' },
      { label: 'SAFETY COMPLIANCE', value: '96.4%', color: '#10b981' }
    ]
  }
};

export const DOMAIN_OPTIONS = [
  {
    value: 'Engineering Leader',
    label: 'Engineering Leader',
    subtitle: 'Architecture & AI Governance',
    icon: Brain
  },
  {
    value: 'AI for AMS',
    label: 'AI for AMS',
    subtitle: 'Application Management Services',
    icon: Server
  },
  {
    value: 'AI for AD',
    label: 'AI for AD',
    subtitle: 'Autonomous Delivery & Requirements',
    icon: Layers
  }
];

// Domain-scoped roles — to add a new role, push into the relevant domain's array
export const DOMAIN_ROLE_MAP = {
  'Engineering Leader': [
    {
      value: 'Chief AI Officer',
      label: 'Chief AI Officer',
      subtitle: 'Alex • Architecture & Governance',
      icon: ShieldCheck
    }
  ],
  'Engineering leaders': [
    {
      value: 'Chief AI Officer',
      label: 'Chief AI Officer',
      subtitle: 'Alex • Architecture & Governance',
      icon: ShieldCheck
    }
  ],
  'AI for AMS': [
    {
      value: 'Head of AMS',
      label: 'Head of AMS',
      subtitle: 'Tony • Operations & Triage',
      icon: User
    }
  ],
  'AI for AD': [
    {
      value: 'Product Owner',
      label: 'Product Owner',
      subtitle: 'Product Owner • Backlog & Epics',
      icon: UserCheck
    }
  ]
};

// Ensure both plural and singular forms resolve seamlessly
DOMAIN_PERSONA_MAP['Engineering leader'] = DOMAIN_PERSONA_MAP['Engineering Leader'];
DOMAIN_PERSONA_MAP['Engineering leaders'] = DOMAIN_PERSONA_MAP['Engineering Leader'];
DOMAIN_ROLE_MAP['Engineering leader'] = DOMAIN_ROLE_MAP['Engineering Leader'];
DOMAIN_ROLE_MAP['Engineering leaders'] = DOMAIN_ROLE_MAP['Engineering Leader'];

/**
 * CustomSelect - Sleek, accessible, enterprise dropdown
 */
export function CustomSelect({ label, value, onChange, options, minWidth = '180px', fullWidth = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [triggerWidth, setTriggerWidth] = useState(240);

  // Recalculate menu position when opening (for fixed-position mode inside sidebar)
  useEffect(() => {
    if (isOpen && fullWidth && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 6, left: rect.left });
      setTriggerWidth(rect.width);
    }
  }, [isOpen, fullWidth]);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const selectedOption = options.find((opt) => opt.value === value || (value?.includes('Engineering') && opt.value?.includes('Engineering'))) || options[0];
  const SelectedIcon = selectedOption?.icon;

  const menuStyle = fullWidth
    ? {
        position: 'fixed',
        top: `${menuPos.top}px`,
        left: `${menuPos.left}px`,
        width: `${triggerWidth}px`,
        minWidth: '220px',
        maxWidth: '300px',
        boxSizing: 'border-box',
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-lg)',
        padding: '6px',
        zIndex: 9999,
        animation: 'fadeIn 0.15s ease-out'
      }
    : {
        position: 'absolute',
        top: 'calc(100% + 6px)',
        right: 0,
        minWidth: '270px',
        width: 'auto',
        boxSizing: 'border-box',
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-lg)',
        padding: '6px',
        zIndex: 350,
        animation: 'fadeIn 0.15s ease-out'
      };

  return (
    <div style={{
      display: 'flex',
      flexDirection: fullWidth ? 'column' : 'row',
      alignItems: fullWidth ? 'stretch' : 'center',
      gap: fullWidth ? '4px' : '8px',
      width: fullWidth ? '100%' : 'auto',
      boxSizing: 'border-box'
    }}>
      {label && (
        <label style={{
          fontSize: fullWidth ? '0.70rem' : '0.8rem',
          color: 'var(--text-muted)',
          fontWeight: 700,
          letterSpacing: fullWidth ? '0.06em' : '0.03em',
          textTransform: fullWidth ? 'uppercase' : 'none',
          userSelect: 'none',
          paddingLeft: fullWidth ? '2px' : '0'
        }}>
          {label}
        </label>
      )}

      <div ref={dropdownRef} style={{ position: 'relative', width: fullWidth ? '100%' : 'auto' }}>
        {/* Trigger Button */}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            width: fullWidth ? '100%' : 'auto',
            minWidth: fullWidth ? '0' : minWidth,
            boxSizing: 'border-box',
            padding: '7px 11px',
            background: isOpen ? 'var(--bg-subtle)' : 'var(--bg-surface)',
            border: isOpen ? '1.5px solid var(--stellantis-action)' : '1.5px solid var(--border-color)',
            borderRadius: '9px',
            cursor: 'pointer',
            boxShadow: isOpen ? '0 0 0 3px rgba(2, 132, 199, 0.18)' : 'var(--shadow-sm)',
            transition: 'all 0.18s ease',
            outline: 'none',
            textAlign: 'left'
          }}
          onMouseEnter={e => {
            if (!isOpen) {
              e.currentTarget.style.borderColor = 'var(--border-strong)';
              e.currentTarget.style.background = 'var(--bg-surface-secondary)';
            }
          }}
          onMouseLeave={e => {
            if (!isOpen) {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.background = 'var(--bg-surface)';
            }
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', minWidth: 0, flex: 1 }}>
            {SelectedIcon && (
              <SelectedIcon size={15} color="var(--stellantis-action)" style={{ flexShrink: 0 }} />
            )}
            <span style={{
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {selectedOption?.label || value}
            </span>
          </div>

          <ChevronDown
            size={14}
            color="var(--text-muted)"
            style={{
              flexShrink: 0,
              transition: 'transform 0.2s ease',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
          />
        </button>

        {/* Floating Custom Menu */}
        {isOpen && (
          <div style={menuStyle}>
            {options.map((option) => {
              const isSelected = option.value === value;
              const OptionIcon = option.icon;

              return (
                <div
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: isSelected ? 'var(--badge-info-bg)' : 'transparent',
                    color: isSelected ? 'var(--stellantis-action)' : 'var(--text-primary)',
                    transition: 'all 0.12s ease',
                    marginBottom: '2px'
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) e.currentTarget.style.background = 'var(--bg-subtle)';
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden', minWidth: 0, flex: 1 }}>
                    {OptionIcon && (
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        background: isSelected ? 'rgba(2, 132, 199, 0.15)' : 'var(--bg-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <OptionIcon size={15} color={isSelected ? 'var(--stellantis-action)' : 'var(--text-secondary)'} />
                      </div>
                    )}
                    <div style={{ overflow: 'hidden', minWidth: 0, flex: 1 }}>
                      <div style={{
                        fontWeight: isSelected ? 700 : 600,
                        fontSize: '0.84rem',
                        color: isSelected ? 'var(--stellantis-action)' : 'var(--text-primary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {option.label}
                      </div>
                      {option.subtitle && (
                        <div style={{
                          fontSize: '0.70rem',
                          color: 'var(--text-muted)',
                          marginTop: '1px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {option.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function WorkspaceBar({ selectedDomain, onDomainChange, selectedRole, onRoleChange, allowedDomains = [], allowedRoles = [] }) {
  const handleRoleSelect = (role) => {
    onRoleChange(role);
  };

  const isDomainAllowed = (optVal) => {
    return allowedDomains.some(d => {
      if (!d) return false;
      if (d === optVal) return true;
      if (optVal === 'Engineering Leader' && d.toLowerCase().includes('engineering')) return true;
      return false;
    });
  };

  // Filter available domains based on user's allowed domains
  const availableDomains = DOMAIN_OPTIONS.filter(opt => isDomainAllowed(opt.value));
  
  // Fallback to all if somehow allowedDomains is empty to prevent crashes
  const displayDomains = availableDomains.length > 0 ? availableDomains : DOMAIN_OPTIONS;

  // Filter available roles based on user's allowed roles
  const availableRoles = (DOMAIN_ROLE_MAP[selectedDomain] || []).filter(opt => allowedRoles.includes(opt.value));
  const displayRoles = availableRoles.length > 0 ? availableRoles : (DOMAIN_ROLE_MAP[selectedDomain] || []);

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      padding: '12px 24px',
      margin: '20px 0 16px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: 'var(--shadow-sm)',
      flexWrap: 'wrap',
      gap: '12px'
    }}>
      {/* Left breadcrumb summary */}
      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Active Workspace:</span>{' '}
        Viewing as <strong style={{ color: 'var(--stellantis-accent)', fontWeight: 600 }}>{selectedRole}</strong>
      </div>

      {/* Right Selector Dropdowns */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        {/* Custom Domain Dropdown */}
        <CustomSelect
          label="Domain:"
          value={selectedDomain}
          onChange={onDomainChange}
          options={displayDomains}
          minWidth="170px"
        />

        {/* Custom Role Dropdown */}
        <CustomSelect
          label="Role:"
          value={selectedRole}
          onChange={handleRoleSelect}
          options={displayRoles}
          minWidth="180px"
        />
      </div>
    </div>
  );
}
