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

  // In light mode: white header with navy text. In dark mode: deep navy header with white text.
  const headerBg        = light ? '#ffffff' : '#0e1e38';
  const headerBorder    = light ? '#e2e8f4' : '#1d3460';
  const headerShadow    = light ? '0 1px 6px rgba(14,30,56,0.08)' : '0 2px 12px rgba(6,13,28,0.50)';
  const logoSrc         = light ? '/stellantis-light-1QxnmsD2.svg' : '/stellantis-dark-ww179IYK.svg';
  const dividerColor    = light ? 'rgba(14,30,56,0.15)' : 'rgba(255,255,255,0.2)';
  const subtitleColor   = light ? 'rgba(14,30,56,0.45)' : 'rgba(255,255,255,0.50)';
  const iconBtnBg       = light ? 'rgba(14,30,56,0.06)' : 'rgba(255,255,255,0.10)';
  const iconBtnBorder   = light ? 'rgba(14,30,56,0.12)' : 'rgba(255,255,255,0.15)';
  const iconBtnColor    = light ? '#0e1e38' : 'rgba(255,255,255,0.85)';
  const iconBtnHoverBg  = light ? 'rgba(14,30,56,0.12)' : 'rgba(255,255,255,0.18)';
  const profileBg       = light ? 'rgba(14,30,56,0.06)' : 'rgba(255,255,255,0.08)';
  const profileBorder   = light ? 'rgba(14,30,56,0.12)' : 'rgba(255,255,255,0.12)';
  const profileHoverBg  = light ? 'rgba(14,30,56,0.12)' : 'rgba(255,255,255,0.14)';
  const nameColor       = light ? '#0e1e38' : '#ffffff';
  const roleColor       = light ? 'rgba(14,30,56,0.50)' : 'rgba(255,255,255,0.55)';
  const chevronColor    = light ? 'rgba(14,30,56,0.45)' : 'rgba(255,255,255,0.55)';

  return (
    <header style={{
      background: headerBg,
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
      transition: 'background 0.2s ease, box-shadow 0.2s ease'
    }}>

      {/* ── Left: Stellantis Logo ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <img
          src={logoSrc}
          alt="Stellantis"
          style={{
            height: '24px',
            width: 'auto',
            objectFit: 'contain',
            display: 'block',
            userSelect: 'none'
          }}
        />

        <div style={{ width: '1px', height: '22px', background: dividerColor }} />
        <span style={{
          fontSize: '0.70rem',
          fontWeight: 600,
          color: subtitleColor,
          letterSpacing: '0.07em',
          textTransform: 'uppercase'
        }}>
          AI-Native Engineering Hub
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
              background: 'var(--bg-surface)', border: '1px solid var(--border-color)',
              borderRadius: '12px', boxShadow: 'var(--shadow-lg)', padding: '8px',
              zIndex: 200, animation: 'fadeIn 0.15s ease-out'
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
