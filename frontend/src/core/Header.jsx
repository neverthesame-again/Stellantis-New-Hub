import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, ChevronDown, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

const isLight = (theme) => theme === 'light';

export default function Header({ currentTheme, toggleTheme, activePersona }) {
  const { user, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const light = isLight(currentTheme);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Translucent Glassmorphic Header styling driven by CSS tokens
  const headerBg        = 'var(--header-bg)';
  const headerBorder    = 'var(--header-border)';
  const headerShadow    = 'var(--shadow-header)';
  const iconBtnBg       = 'var(--bg-subtle)';
  const iconBtnBorder   = 'var(--border-color)';
  const iconBtnColor    = 'var(--text-primary)';
  const iconBtnHoverBg  = 'var(--bg-surface-elevated)';
  const profileBg       = 'var(--bg-subtle)';
  const profileBorder   = 'var(--border-color)';
  const profileHoverBg  = 'var(--bg-surface-elevated)';
  const nameColor       = 'var(--text-primary)';
  const roleColor       = 'var(--text-muted)';
  const chevronColor    = 'var(--text-muted)';

  return (
    <header style={{
      background: headerBg,
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: `1px solid ${headerBorder}`,
      padding: '0 28px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: headerShadow,
      transition: 'background 0.3s ease, border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease'
    }}>

      {/* ── Left: Plain text branding (No Logo) ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <span style={{
          fontSize: '1.05rem',
          fontWeight: 700,
          color: nameColor,
          letterSpacing: '-0.01em',
          userSelect: 'none'
        }}>
          AI-Native Engineering Operating Model Hub
        </span>
      </div>

      {/* ── Right: Controls ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={light ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          style={{
            background: iconBtnBg,
            border: `1px solid ${iconBtnBorder}`,
            color: iconBtnColor,
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            flexShrink: 0
          }}
          onMouseEnter={e => { e.currentTarget.style.background = iconBtnHoverBg; }}
          onMouseLeave={e => { e.currentTarget.style.background = iconBtnBg; }}
        >
          {light ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* User Profile Dropdown */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: profileBg,
              border: `1px solid ${profileBorder}`,
              cursor: 'pointer',
              padding: '5px 12px 5px 6px',
              borderRadius: '28px',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = profileHoverBg; }}
            onMouseLeave={e => { e.currentTarget.style.background = profileBg; }}
          >
            <div style={{
              width: '30px', height: '30px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #1a3a6e, #0284c7)',
              color: '#ffffff', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0
            }}>
              {(user?.full_name || 'U').charAt(0).toUpperCase()}
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: nameColor }}>{user?.full_name || 'User'}</div>
              <div style={{ fontSize: '0.68rem', color: roleColor, whiteSpace: 'nowrap' }}>
                {activePersona.role} • {activePersona.domain}
              </div>
            </div>
            <ChevronDown size={14} color={chevronColor} style={{ flexShrink: 0 }} />
          </button>

          {profileDropdownOpen && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: '270px',
              background: 'var(--bg-popover)', border: '1px solid var(--border-color)',
              backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '12px', boxShadow: '0 12px 32px rgba(14, 30, 56, 0.22)', padding: '8px',
              zIndex: 9999, animation: 'fadeIn 0.15s ease-out'
            }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>Current Session</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{user?.full_name || 'User'}</div>
                <div style={{ fontSize: '0.75rem', color: light ? '#1a3a6e' : '#60a5fa', fontWeight: 600 }}>{user?.email}</div>
              </div>
              <div style={{ padding: '4px' }}>
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    logout();
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 10px',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#ef4444',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-subtle)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  <UserCheck size={15} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
