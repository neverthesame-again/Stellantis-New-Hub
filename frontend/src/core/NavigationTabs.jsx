import React from 'react';
import { LayoutDashboard, Inbox, Sparkles } from 'lucide-react';

/**
 * NavigationTabs — Horizontal pill-button pane
 * Renders as a single contained rectangle card with three segmented buttons inside.
 */
export default function NavigationTabs({ activeTab, onTabChange, inboxCount = 6 }) {
  const tabs = [
    { id: 'dashboard',   label: 'Dashboard',          icon: LayoutDashboard, badge: null },
    { id: 'inbox',       label: 'Workflow Inbox',      icon: Inbox,           badge: inboxCount },
    { id: 'experience',  label: 'AI Experience Zone',  icon: Sparkles,        badge: null }
  ];

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      padding: '8px',
      margin: '16px 0 24px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            id={`nav-tab-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            style={{
              flex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: isActive ? 'var(--nav-active-tab-bg, #0e1e38)' : 'transparent',
              color: isActive ? '#ffffff' : 'var(--text-primary)',
              transition: 'all 0.15s ease',
              boxShadow: isActive ? '0 3px 10px rgba(14, 30, 56, 0.30)' : 'none',
              border: isActive ? '1px solid var(--nav-active-tab-border, #0e1e38)' : '1px solid transparent',
              outline: 'none',
              letterSpacing: '0.01em'
            }}
            onMouseEnter={e => {
              if (!isActive) e.currentTarget.style.background = 'var(--bg-subtle)';
            }}
            onMouseLeave={e => {
              if (!isActive) e.currentTarget.style.background = 'transparent';
            }}
          >
            <Icon size={16} color={isActive ? '#ffffff' : 'var(--text-secondary)'} />
            <span>{tab.label}</span>
            {tab.badge !== null && (
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: '10px',
                background: isActive ? 'rgba(255, 255, 255, 0.20)' : 'var(--bg-subtle)',
                color: isActive ? '#ffffff' : 'var(--text-primary)',
                border: isActive ? 'none' : '1px solid var(--border-color)',
                minWidth: '22px',
                textAlign: 'center'
              }}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
