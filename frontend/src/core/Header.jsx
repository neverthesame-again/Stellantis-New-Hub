import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, ChevronDown, UserCheck, Sparkles } from 'lucide-react';
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

  // Light mode: white header with dark text. Dark mode: black header with white text. Light blue accents in both.
  const headerBg        = light ? '#ffffff' : '#000000';
  const headerBorder    = light ? '#d6ebf7' : '#1a2733';
  const headerShadow    = light ? '0 1px 6px rgba(2,132,199,0.08)' : '0 1px 0 rgba(56,189,248,0.12)';
  const brandColor      = light ? '#0b1620' : '#ffffff';
  const brandAccent     = light ? '#0284c7' : '#38bdf8';
  const dividerColor    = light ? 'rgba(2,132,199,0.20)' : 'rgba(56,189,248,0.25)';
  const subtitleColor   = light ? 'rgba(11,22,32,0.50)' : 'rgba(255,255,255,0.55)';
  const iconBtnBg       = light ? 'rgba(2,132,199,0.06)' : 'rgba(56,189,248,0.08)';
  const iconBtnBorder   = light ? 'rgba(2,132,199,0.18)' : 'rgba(56,189,248,0.20)';
  const iconBtnColor    = light ? '#0284c7' : '#7dd3fc';
  const iconBtnHoverBg  = light ? 'rgba(2,132,199,0.12)' : 'rgba(56,189,248,0.16)';
  const profileBg       = light ? 'rgba(2,132,199,0.05)' : 'rgba(56,189,248,0.06)';
  const profileBorder   = light ? 'rgba(2,132,199,0.15)' : 'rgba(56,189,248,0.18)';
  const profileHoverBg  = light ? 'rgba(2,132,199,0.10)' : 'rgba(56,189,248,0.12)';
  const nameColor       = light ? '#0b1620' : '#ffffff';
  const roleColor       = light ? 'rgba(11,22,32,0.55)' : 'rgba(255,255,255,0.55)';
  const chevronColor    = light ? 'rgba(11,22,32,0.45)' : 'rgba(255,255,255,0.55)';

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

      {/* ── Left: AI Hub Logo ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', userSelect: 'none' }}>
          <div style={{
            width: '30px', height: '30px', borderRadius: '8px',
            background: light ? '#e0f2fe' : 'rgba(56,189,248,0.12)',
            border: `1px solid ${light ? '#bae6fd' : 'rgba(56,189,248,0.35)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Sparkles size={16} color={brandAccent} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: brandColor, letterSpacing: '-0.01em' }}>
            AI <span style={{ color: brandAccent }}>Hub</span>
          </span>
        </div>

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
              background: light ? '#0284c7' : '#38bdf8',
              color: light ? '#ffffff' : '#000000', display: 'flex', alignItems: 'center',
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
                <div style={{ fontSize: '0.75rem', color: light ? '#0284c7' : '#38bdf8', fontWeight: 600 }}>{user?.email}</div>
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
