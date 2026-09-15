import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Eye, EyeOff, AlertCircle, Clock, CheckCircle, ChevronDown } from 'lucide-react';
import { useAuth } from './AuthContext';
import './auth.css';

// ── Domain → Role mapping (mirrors WorkspaceBar)
const DOMAIN_ROLE_MAP = {
  'AI for AMS':          ['Head of AMS'],
  'Engineering leaders': ['Chief AI Officer'],
  'AI for AD':           ['Product Owner'],
};

const DOMAINS = Object.keys(DOMAIN_ROLE_MAP);
const ALL_ROLES = Object.values(DOMAIN_ROLE_MAP).flat();

function MultiSelectDropdown({ label, options, selectedValues, onChange, placeholder, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    function handleClickOutside(e) { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (val) => {
    if (selectedValues.includes(val)) onChange(selectedValues.filter(v => v !== val));
    else onChange([...selectedValues, val]);
  };

  return (
    <div className="auth-field-group" ref={ref} style={{ position: 'relative' }}>
      <label className="auth-label">{label}</label>
      <div 
        className={`auth-input ${disabled ? 'disabled' : ''}`} 
        style={{ 
          cursor: disabled ? 'not-allowed' : 'pointer', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: disabled ? 'var(--bg-subtle, #f8f9fa)' : 'transparent',
          opacity: disabled ? 0.6 : 1
        }} 
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: selectedValues.length ? 'inherit' : 'var(--text-muted)' }}>
          {selectedValues.length === 0 ? placeholder : selectedValues.join(', ')}
        </span>
        <ChevronDown size={14} style={{ flexShrink: 0, color: 'var(--text-muted)' }} />
      </div>
      {isOpen && !disabled && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, marginTop: '4px', zIndex: 10, width: '100%',
          background: 'var(--bg-surface, #ffffff)', border: '1px solid var(--border-color, #e2e8f4)',
          borderRadius: '8px', padding: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          {options.length === 0 ? <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '4px' }}>No options available</div> : options.map(opt => (
            <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 6px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
              <input 
                type="checkbox" 
                checked={selectedValues.includes(opt)} 
                onChange={() => handleToggle(opt)} 
                style={{ cursor: 'pointer', accentColor: '#1a3a6e' }}
              />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}



// ── Feature cards (shorter text for register panel)
const FEATURES = [
  { icon: '💻', cls: 'icon-ad',    text: <><strong>AI for AD:</strong> Workspaces for Product Owner &amp; Developer</> },
  { icon: '🔧', cls: 'icon-ams',   text: <><strong>AI for AMS:</strong> Incident &amp; problem desks for Support Engineer &amp; Software Engineer</> },
  { icon: '🛡️', cls: 'icon-infra', text: <><strong>Engineering leaders:</strong> Enterprise AI Governance, Architecture Standards &amp; Cross-Portfolio Model Strategy</> }
];

// ── Pending Approval Screen (shown after successful registration)
function PendingApprovalScreen({ profile, onBackToLogin }) {
  const { saveSession } = useAuth();

  useEffect(() => {
    // Generate random delay between 5 and 40 seconds
    const delay = Math.floor(Math.random() * (40000 - 5000 + 1)) + 5000;
    
    const timer = setTimeout(() => {
      onBackToLogin(); // Redirect to login page instead of auto login
    }, delay);
    
    return () => clearTimeout(timer);
  }, [profile, saveSession]);

  return (
    <div className="auth-pending-screen">
      <div className="auth-pending-icon">⏳</div>

      <h2 className="auth-pending-title">Registration Submitted</h2>

      <p className="auth-pending-message">
        Thank you for registering on the Stellantis AI Platform. Your account is currently under review by the platform administrator.
        <br /><br />
        Please check back shortly — your workspace will be ready once access has been granted.
      </p>

      <div className="auth-pending-badge">
        <div className="auth-pending-dot" />
        Awaiting administrator approval
      </div>

      <div className="auth-alert info" style={{ maxWidth: '340px', textAlign: 'left' }}>
        <Clock size={15} style={{ flexShrink: 0, marginTop: '1px' }} />
        <span>
          Access is typically granted within a few minutes. Please try logging in shortly.
        </span>
      </div>

      <button className="auth-pending-back-btn" onClick={onBackToLogin}>
        Back to Sign In
      </button>
    </div>
  );
}

// ── Main Register Page
export default function RegisterPage({ onNavigateToLogin }) {
  const { register } = useAuth();

  const [fullName, setFullName]         = useState('');
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [confirmPw, setConfirmPw]       = useState('');
  const [employeeId, setEmployeeId]     = useState('');
  const [domains, setDomains]           = useState([]);
  const [roles, setRoles]               = useState([]);
  const [showPw, setShowPw]             = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [errorMsg, setErrorMsg]         = useState('');
  const [pendingProfile, setPendingProfile] = useState(null); // set → show pending screen

  // ── Auto-map roles and domains exactly
  const handleDomainChange = (newDomains) => {
    setDomains(newDomains);
    setErrorMsg('');
    
    // Auto-select corresponding roles
    let newRoles = [];
    newDomains.forEach(d => {
      if (DOMAIN_ROLE_MAP[d]) {
        newRoles = [...newRoles, ...DOMAIN_ROLE_MAP[d]];
      }
    });
    setRoles(newRoles);
  };

  const handleRoleChange = (newRoles) => {
    setRoles(newRoles);
    setErrorMsg('');
    
    // Auto-select corresponding domains
    let newDomains = [];
    Object.keys(DOMAIN_ROLE_MAP).forEach(d => {
      const domainRoles = DOMAIN_ROLE_MAP[d];
      if (domainRoles.some(r => newRoles.includes(r))) {
        newDomains.push(d);
      }
    });
    setDomains(newDomains);
  };

  // ── Password validation rules
  const pwRules = [
    { label: 'At least 8 characters',               pass: password.length >= 8 },
    { label: 'At least 1 uppercase letter (A–Z)',    pass: /[A-Z]/.test(password) },
    { label: 'At least 1 number (0–9)',              pass: /[0-9]/.test(password) },
    { label: 'At least 1 special character (!@#$…)', pass: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password) },
  ];
  const pwValid = pwRules.every((r) => r.pass);
  const pwsMatch = password === confirmPw;

  const emailRegex = /^[^\s@]+@tcs\.com$/;
  const emailInvalid = email.length > 0 && !emailRegex.test(email.toLowerCase());
  
  const fullNameValid = fullName.trim().length >= 2;
  const employeeIdRegex = /^[a-zA-Z0-9]{5,20}$/;
  const employeeIdValid = employeeId.trim().length === 0 || employeeIdRegex.test(employeeId.trim());

  const isFormValid = 
    fullNameValid && 
    emailRegex.test(email.toLowerCase()) && 
    pwValid && 
    pwsMatch && 
    employeeIdRegex.test(employeeId.trim()) && 
    domains.length > 0 && 
    roles.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullNameValid) {
      setErrorMsg('Full name must be at least 2 characters long.');
      return;
    }
    
    if (!emailRegex.test(email.toLowerCase())) {
      setErrorMsg('Please enter a valid @tcs.com email address.');
      return;
    }

    if (!pwValid) {
      setErrorMsg('Your password does not meet all the requirements listed below.');
      return;
    }
    
    if (!pwsMatch) {
      setErrorMsg('Passwords do not match. Please re-enter your password.');
      return;
    }
    
    if (!employeeIdRegex.test(employeeId.trim())) {
      setErrorMsg('Employee ID must be alphanumeric and at least 5 characters long.');
      return;
    }
    
    if (domains.length === 0 || roles.length === 0) {
      setErrorMsg('Please select at least one Domain and Role.');
      return;
    }

    setSubmitting(true);
    try {
      const domainStr = domains.join(', ');
      const roleStr = roles.join(', ');
      const newProfile = await register({ fullName, email, password, employeeId, domain: domainStr, role: roleStr });
      setPendingProfile(newProfile); // show pending screen
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Show pending screen after successful registration
  if (pendingProfile) {
    return (
      <div className="auth-root">
        <div className="auth-card">
          <div className="auth-left">
            <div className="auth-platform-badge">
              <div className="auth-platform-dot" />
              <span>Stellantis AI Platform</span>
            </div>
            <h1 className="auth-left-headline">Welcome to the Future of Enterprise AI</h1>
            <p className="auth-left-subtext">
              Your registration is being processed. The platform administrator will review and grant access shortly.
            </p>
            <div className="auth-feature-list">
              {FEATURES.map((f, i) => (
                <div className="auth-feature-item" key={i}>
                  <div className={`auth-feature-icon ${f.cls}`}>{f.icon}</div>
                  <p className="auth-feature-text">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="auth-right" style={{ justifyContent: 'center' }}>
            <PendingApprovalScreen profile={pendingProfile} onBackToLogin={onNavigateToLogin} />
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="auth-root">
      <div className="auth-card">

        {/* ── Left Panel ── */}
        <div className="auth-left">
          <div className="auth-platform-badge">
            <div className="auth-platform-dot" />
            <span>Stellantis AI Platform</span>
          </div>

          <div>
            <h1 className="auth-left-headline">Create Your Account</h1>
            <p className="auth-left-subtext">
              Get started with role-based enterprise AI designed for innovation. Select your domain and role to unlock dedicated AI agents and project workspaces.
            </p>
          </div>

          <div className="auth-feature-list">
            {FEATURES.map((f, i) => (
              <div className="auth-feature-item" key={i}>
                <div className={`auth-feature-icon ${f.cls}`}>{f.icon}</div>
                <p className="auth-feature-text">{f.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="auth-right">
          <h2 className="auth-form-title">Stellantis AI Platform</h2>
          <p className="auth-form-subtitle">Create your account</p>

          {errorMsg && (
            <div className="auth-alert error" style={{ marginBottom: '4px' }}>
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '1px' }} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>

            {/* Full Name */}
            <div className="auth-field-group">
              <label className="auth-label" htmlFor="reg-fullname">Full Name</label>
              <input
                id="reg-fullname"
                className="auth-input"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            {/* TCS Email */}
            <div className="auth-field-group">
              <label className="auth-label" htmlFor="reg-email">TCS Email</label>
              <input
                id="reg-email"
                className={`auth-input${emailInvalid ? ' auth-input-error' : ''}`}
                type="email"
                placeholder="your.name@tcs.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
                autoComplete="email"
                required
              />
              {emailInvalid && (
                <span className="auth-error-msg">
                  <AlertCircle size={12} /> Only @tcs.com addresses are allowed.
                </span>
              )}
            </div>

            {/* Password */}
            <div className="auth-field-group">
              <label className="auth-label" htmlFor="reg-password">Password</label>
              <div className="auth-input-wrapper">
                <input
                  id="reg-password"
                  className="auth-input has-icon"
                  type={showPw ? 'text' : 'password'}
                  placeholder="At least 8 characters, 1 uppercase, 1 number, 1 special"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPw((p) => !p)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {/* Real-time validation rules */}
              {password.length > 0 && (
                <div className="auth-pw-rules">
                  {pwRules.map((r) => (
                    <div key={r.label} className={`auth-pw-rule${r.pass ? ' rule-pass' : ''}`}>
                      <span className="auth-pw-rule-dot" />
                      {r.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="auth-field-group">
              <label className="auth-label" htmlFor="reg-confirm-pw">Confirm Password</label>
              <div className="auth-input-wrapper">
                <input
                  id="reg-confirm-pw"
                  className={`auth-input has-icon${confirmPw && !pwsMatch ? ' auth-input-error' : ''}`}
                  type={showConfirmPw ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowConfirmPw((p) => !p)}
                  aria-label={showConfirmPw ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {confirmPw && !pwsMatch && (
                <span className="auth-error-msg">
                  <AlertCircle size={12} /> Passwords do not match.
                </span>
              )}
              {confirmPw && pwsMatch && password.length > 0 && (
                <span className="auth-error-msg" style={{ color: '#10b981' }}>
                  <CheckCircle size={12} /> Passwords match.
                </span>
              )}
            </div>

            {/* Employee ID */}
            <div className="auth-field-group">
              <label className="auth-label" htmlFor="reg-empid">Employee ID</label>
              <input
                id="reg-empid"
                className="auth-input"
                type="text"
                placeholder="e.g. TCS1234567"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
              />
            </div>

            {/* Domain */}
            <MultiSelectDropdown
              label="Domains"
              options={DOMAINS}
              selectedValues={domains}
              onChange={handleDomainChange}
              placeholder="Select Domain(s)…"
            />

            {/* Role */}
            <MultiSelectDropdown
              label="Roles"
              options={ALL_ROLES}
              selectedValues={roles}
              onChange={handleRoleChange}
              placeholder="Select Role(s)…"
            />

            {/* Submit */}
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={submitting || !isFormValid}
              style={{ marginTop: '4px' }}
            >
              {submitting
                ? <><span className="auth-spinner" />Creating Account…</>
                : 'Create Account'
              }
            </button>
          </form>

          <p className="auth-switch-row">
            Already have an account?{' '}
            <button className="auth-link-btn" onClick={onNavigateToLogin}>Sign In</button>
          </p>
        </div>
      </div>
    </div>
  );
}
