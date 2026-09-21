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
  'Engineering leaders': {
    domain: 'Engineering leaders',
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

const DOMAIN_OPTIONS = [
  {
    value: 'Engineering leaders',
    label: 'Engineering leaders',
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

/**
 * CustomSelect - Sleek, accessible, enterprise dropdown
 */
function CustomSelect({ label, value, onChange, options, minWidth = '180px' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  const selectedOption = options.find((opt) => opt.value === value) || options[0];
  const SelectedIcon = selectedOption?.icon;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {label && (
        <label style={{
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          fontWeight: 600,
          letterSpacing: '0.03em'
        }}>
          {label}
        </label>
      )}

      <div ref={dropdownRef} style={{ position: 'relative' }}>
        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            minWidth: minWidth,
            padding: '7px 12px 7px 12px',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
            {SelectedIcon && (
              <SelectedIcon size={15} color="var(--stellantis-action)" style={{ flexShrink: 0 }} />
            )}
            <span style={{
              fontSize: '0.85rem',
              fontWeight: 700,
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
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            minWidth: '270px',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-lg)',
            padding: '6px',
            zIndex: 350,
            animation: 'fadeIn 0.15s ease-out'
          }}>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                    <div>
                      <div style={{
                        fontWeight: isSelected ? 700 : 600,
                        fontSize: '0.84rem',
                        color: isSelected ? 'var(--stellantis-action)' : 'var(--text-primary)'
                      }}>
                        {option.label}
                      </div>
                      {option.subtitle && (
                        <div style={{
                          fontSize: '0.70rem',
                          color: 'var(--text-muted)',
                          marginTop: '1px'
                        }}>
                          {option.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <Check size={15} color="#10b981" style={{ flexShrink: 0, marginLeft: '8px' }} />
                  )}
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

  // Filter available domains based on user's allowed domains
  const availableDomains = DOMAIN_OPTIONS.filter(opt => allowedDomains.includes(opt.value));
  
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
