import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from './AuthContext';
import './auth.css';

// ── Domain → Role mapping (mirrors WorkspaceBar)
const DOMAIN_ROLE_MAP = {
  'AI for AMS':          ['Head of AMS'],
  'Engineering leaders': ['Chief AI Officer'],
  'AI for AD':           ['Product Owner'],
};

const DOMAINS = Object.keys(DOMAIN_ROLE_MAP);

const FEATURES = [
  {
    icon: '💻',
    cls: 'icon-ad',
    text: <><strong>AI for AD:</strong> Workspaces for Product Owner, Developer featuring code synthesis, BDD stories.</>,
  },
  {
    icon: '🔧',
    cls: 'icon-ams',
    text: <><strong>AI for AMS:</strong> Specialized desks for Support Engineer &amp; Software Engineer — powering ticket triage, RCA diagnostics, PRD generator &amp; SLA watch.</>,
  },
  {
    icon: '🛡️',
    cls: 'icon-infra',
    text: <><strong>Engineering leaders:</strong> Enterprise AI Governance, Architecture Standards &amp; Cross-Portfolio Model Strategy.</>,
  },
];

// ── Step 1: Verify Identity
// ── Step 2: Set New Password
function ForgotPasswordModal({ onClose }) {
  const { requestPasswordReset } = useAuth();
  const [step, setStep] = useState(1); // 1 = verify identity, 2 = new password
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const pwRules = [
    { label: 'At least 8 characters', pass: newPassword.length >= 8 },
    { label: 'At least 1 uppercase letter', pass: /[A-Z]/.test(newPassword) },
    { label: 'At least 1 number', pass: /[0-9]/.test(newPassword) },
    { label: 'At least 1 special character (!@#$%^&*)', pass: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword) },
  ];
  const pwValid = pwRules.every((r) => r.pass);

  const handleVerify = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email.toLowerCase().endsWith('@tcs.com')) {
      setErrorMsg('Only @tcs.com email addresses are permitted.');
      return;
    }
    setStep(2);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!pwValid) { setErrorMsg('Password does not meet all requirements.'); return; }
    if (newPassword !== confirmPassword) { setErrorMsg('Passwords do not match.'); return; }

    setStatus('loading');
    try {
      await requestPasswordReset(email, employeeId, newPassword);
      setStatus('success');
    } catch (err) {
      setErrorMsg(err.message);
      setStatus('error');
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="auth-modal">
        <div className="auth-modal-header">
          <div>
            <h2 className="auth-modal-title">Reset Your Password</h2>
            <p className="auth-modal-desc">
              {step === 1
                ? 'Enter your TCS email and Employee ID to verify your identity.'
                : 'Your identity has been verified. Set your new password below.'}
            </p>
          </div>
          <button className="auth-modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>

        {status === 'success' ? (
          <div className="auth-alert success">
            <CheckCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
            <span>Your password has been updated successfully. You may now sign in with your new password.</span>
          </div>
        ) : step === 1 ? (
          <form onSubmit={handleVerify} className="auth-form" style={{ gap: '14px' }}>
            {errorMsg && (
              <div className="auth-alert error">
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}
            <div className="auth-field-group">
              <label className="auth-label">TCS Email Address</label>
              <input
                className="auth-input"
                type="email"
                placeholder="your.name@tcs.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="auth-field-group">
              <label className="auth-label">Employee ID</label>
              <input
                className="auth-input"
                type="text"
                placeholder="e.g. TCS1234567"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="auth-submit-btn">Verify Identity</button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="auth-form" style={{ gap: '14px' }}>
            {errorMsg && (
              <div className="auth-alert error">
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}
            <div className="auth-field-group">
              <label className="auth-label">New Password</label>
              <div className="auth-input-wrapper">
                <input
                  className="auth-input has-icon"
                  type={showNewPw ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button type="button" className="auth-eye-btn" onClick={() => setShowNewPw((p) => !p)}>
                  {showNewPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {newPassword.length > 0 && (
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
            <div className="auth-field-group">
              <label className="auth-label">Confirm New Password</label>
              <div className="auth-input-wrapper">
                <input
                  className={`auth-input has-icon${confirmPassword && confirmPassword !== newPassword ? ' auth-input-error' : ''}`}
                  type={showConfirmPw ? 'text' : 'password'}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button type="button" className="auth-eye-btn" onClick={() => setShowConfirmPw((p) => !p)}>
                  {showConfirmPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {confirmPassword && confirmPassword !== newPassword && (
                <span className="auth-error-msg">Passwords do not match.</span>
              )}
            </div>
            <button type="submit" className="auth-submit-btn" disabled={status === 'loading'}>
              {status === 'loading' ? <><span className="auth-spinner" />Updating…</> : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Main Login Page
export default function LoginPage({ onNavigateToRegister }) {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [domain, setDomain] = useState('');
  const [role, setRole] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgot, setShowForgot] = useState(false);

  // Sync role when domain changes
  useEffect(() => {
    if (domain && DOMAIN_ROLE_MAP[domain]?.length === 1) {
      setRole(DOMAIN_ROLE_MAP[domain][0]);
    } else {
      setRole('');
    }
  }, [domain]);

  const emailRegex = /^[^\s@]+@tcs\.com$/;
  const emailInvalid = email.length > 0 && !emailRegex.test(email.toLowerCase());
  const passwordInvalid = password.length > 0 && password.trim() === '';
  const isFormValid = email.length > 0 && !emailInvalid && password.trim().length > 0 && domain && role;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!emailRegex.test(email.toLowerCase())) {
      setErrorMsg('Please enter a valid @tcs.com email address.');
      return;
    }

    if (password.trim() === '') {
      setErrorMsg('Password cannot be empty.');
      return;
    }

    if (!domain || !role) {
      setErrorMsg('Please select your Domain and Role.');
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim().toLowerCase(), password, domain, role);
      
      // Save selected domain & role to sessionStorage so App.jsx routes correctly
      sessionStorage.setItem('stellantis_domain', domain);
      sessionStorage.setItem('stellantis_role', role);
      sessionStorage.setItem('stellantis_active_tab', 'dashboard');
      
      // Auth context → App.jsx unmounts this page automatically
    } catch (err) {
      if (err.message === 'PENDING_APPROVAL') {
        setErrorMsg('Your account is currently pending approval. You will receive access once your registration has been reviewed by the platform administrator.');
      } else if (err.message === 'ACCOUNT_SUSPENDED') {
        setErrorMsg('Your account has been suspended. Please contact your platform administrator.');
      } else {
        setErrorMsg(err.message || 'Sign in failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="auth-root">
        <div className="auth-card">

          {/* ── Left Panel ── */}
          <div className="auth-left">
            <div className="auth-platform-badge">
              <div className="auth-platform-dot" />
              <span>Stellantis AI Platform</span>
            </div>

            <div>
              <h1 className="auth-left-headline">Welcome to the Future of Enterprise AI</h1>
              <p className="auth-left-subtext">
                Sign in to access personalized AI workspaces and co-pilots tailored for your domain and role across Stellantis Enterprise AI.
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
            <p className="auth-form-subtitle">Sign in using your TCS credentials</p>

            {errorMsg && (
              <div className="auth-alert error" style={{ marginBottom: '4px' }}>
                <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '1px' }} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="auth-field-group">
                <label className="auth-label" htmlFor="login-email">Email Address</label>
                <input
                  id="login-email"
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
                <label className="auth-label" htmlFor="login-password">Password</label>
                <div className="auth-input-wrapper">
                  <input
                    id="login-password"
                    className="auth-input has-icon"
                    type={showPw ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-eye-btn"
                    onClick={() => setShowPw((p) => !p)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Domain */}
              <div className="auth-field-group">
                <label className="auth-label" htmlFor="login-domain">Domain</label>
                <select
                  id="login-domain"
                  className="auth-select"
                  value={domain}
                  onChange={(e) => { setDomain(e.target.value); setErrorMsg(''); }}
                  required
                >
                  <option value="">Select Domain…</option>
                  {DOMAINS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Role */}
              <div className="auth-field-group">
                <label className="auth-label" htmlFor="login-role">Role</label>
                <select
                  id="login-role"
                  className="auth-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={!domain}
                  required
                >
                  <option value="">{domain ? 'Select Role…' : 'Select Domain First'}</option>
                  {(domain ? (DOMAIN_ROLE_MAP[domain] || []) : []).map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Forgot Password */}
              <div className="auth-forgot-row">
                <button type="button" className="auth-link-btn" onClick={() => setShowForgot(true)}>
                  Forgot Password?
                </button>
              </div>

              {/* Submit */}
              <button type="submit" className="auth-submit-btn" disabled={submitting || !isFormValid}>
                {submitting
                  ? <><span className="auth-spinner" />Signing in…</>
                  : 'Sign In to Platform'
                }
              </button>
            </form>

            <p className="auth-switch-row">
              Don&apos;t have an account?{' '}
              <button className="auth-link-btn" onClick={onNavigateToRegister}>Create Account</button>
            </p>
          </div>
        </div>
      </div>

      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
    </>
  );
}
