import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

const SESSION_KEY = 'stellantis_ai_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // profile row from user_profiles
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
    setLoading(false);
  }, []);

  // Save session helper
  const saveSession = (profile) => {
    setUser(profile);
    localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
  };

  // Clear session helper
  const clearSession = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  // ── LOGIN: query user_profiles directly, validate domain + role
  const login = async (email, password, domain, role) => {
    if (!email || !password || !domain || !role) {
      throw new Error('All fields are required.');
    }
    
    const normalizedEmail = email.trim().toLowerCase();
    const sanitizedPassword = password.trim();

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', normalizedEmail)
      .eq('password_value', sanitizedPassword)
      .single();

    if (error || !data) {
      throw new Error('Incorrect email or password. Please try again.');
    }

    if (data.status === 'pending') {
      throw new Error('PENDING_APPROVAL');
    }

    if (data.status === 'suspended') {
      throw new Error('ACCOUNT_SUSPENDED');
    }

    // Validate that the selected domain + role match the registered profile
    if (!data.domain.includes(domain)) {
      throw new Error(`The selected domain does not match your registered account.`);
    }
    if (!data.role.includes(role)) {
      throw new Error(`The selected role does not match your registered account.`);
    }

    saveSession(data);
    return data;
  };

  // ── REGISTER: insert into user_profiles only
  const register = async ({ fullName, email, password, employeeId, domain, role }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedEmpId = employeeId.trim();
    const normalizedName = fullName.trim();
    const sanitizedPassword = password.trim();

    // Check if email already exists
    const { data: existing } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    // Check if employee ID already exists
    const { data: existingEmp } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('employee_id', normalizedEmpId)
      .maybeSingle();

    if (existingEmp) {
      throw new Error('An account with this Employee ID already exists.');
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        full_name: normalizedName,
        employee_id: normalizedEmpId,
        email: normalizedEmail,
        password_value: sanitizedPassword,
        domain,
        role,
        status: 'approved',
        approved_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  };

  // ── POLL: check approval status for pending users
  const pollApprovalStatus = useCallback(async (email) => {
    const { data } = await supabase
      .from('user_profiles')
      .select('status, domain, role, full_name, employee_id, id')
      .eq('email', email.trim().toLowerCase())
      .single();
    return data || null;
  }, []);

  // ── RESET PASSWORD: verify via Employee ID + Email, then update password
  const requestPasswordReset = async (email, employeeId, newPassword) => {
    const normalizedEmail = email.trim().toLowerCase();

    // Verify identity
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, status')
      .eq('email', normalizedEmail)
      .eq('employee_id', employeeId.trim())
      .single();

    if (error || !data) {
      throw new Error('No account found matching this Employee ID and email combination.');
    }
    if (data.status === 'pending') {
      throw new Error('Your account is still pending approval. Password reset is currently unavailable.');
    }

    // Update password
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ password_value: newPassword })
      .eq('id', data.id);

    if (updateError) throw new Error('Failed to update password. Please try again.');
  };

  // ── LOGOUT
  const logout = () => {
    clearSession();
  };

  const value = {
    user,           // full profile row (or null)
    loading,
    login,
    register,
    logout,
    pollApprovalStatus,
    requestPasswordReset,
    saveSession,    // exposed for pending approval → auto login flow
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
