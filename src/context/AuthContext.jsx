import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isConfiguredSupabase } from '../services/supabase';
import { MOCK_PROFILES } from '../data/mockDatabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth & restore active session
  useEffect(() => {
    // If Supabase is NOT configured (offline/demo mode), auto-login as Citizen
    if (!isConfiguredSupabase()) {
      const savedMockId = localStorage.getItem('samadhan_mock_role');
      const mockProfile = MOCK_PROFILES.find(p => p.role === savedMockId) || MOCK_PROFILES.find(p => p.role === 'CITIZEN');
      setUser({ id: mockProfile.id, email: mockProfile.email });
      setProfile(mockProfile);
      setLoading(false);
      return;
    }

    // Real Supabase Auth Flow
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id, session.user.user_metadata);
        }
      } catch (err) {
        console.warn('Session restoration notice:', err.message);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id, session.user.user_metadata);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId, userMetadata = null) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (data) {
        setProfile(data);
        return data;
      }

      // If profile row does not exist yet (e.g. before trigger), create self-healing profile
      if (userMetadata || user) {
        const defaultProfile = {
          id: userId,
          full_name: userMetadata?.full_name || user?.email?.split('@')[0] || 'Citizen User',
          email: userMetadata?.email || user?.email || '',
          role: userMetadata?.role || 'CITIZEN',
          avatar_url: userMetadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
          created_at: new Date().toISOString()
        };

        const { data: inserted, error: insertError } = await supabase
          .from('profiles')
          .upsert(defaultProfile)
          .select()
          .single();

        if (inserted) {
          setProfile(inserted);
          return inserted;
        }
      }
    } catch (error) {
      console.warn('Profile fetch notice:', error.message);
    }
  };

  // 1-Click Role Switcher for SIH Demo & Offline Mode
  const simulateRole = (role) => {
    const mockUser = MOCK_PROFILES.find(p => p.role === role);
    if (mockUser) {
      localStorage.setItem('samadhan_mock_role', role);
      setUser({ id: mockUser.id, email: mockUser.email });
      setProfile(mockUser);
    }
  };

  const login = async (email, password, roleHint = null) => {
    if (!isConfiguredSupabase()) {
      // Offline / Demo Mode authentication
      let matchedProfile = null;
      if (email) {
        matchedProfile = MOCK_PROFILES.find(p => p.email.toLowerCase() === email.trim().toLowerCase());
      }
      if (!matchedProfile && roleHint) {
        matchedProfile = MOCK_PROFILES.find(p => p.role === roleHint);
      }
      if (!matchedProfile) {
        matchedProfile = MOCK_PROFILES[0]; // fallback to Citizen
      }
      localStorage.setItem('samadhan_mock_role', matchedProfile.role);
      setUser({ id: matchedProfile.id, email: matchedProfile.email });
      setProfile(matchedProfile);
      return { user: matchedProfile, session: { user: matchedProfile } };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ 
      email: email.trim(), 
      password 
    });

    if (error) throw error;

    if (data.user) {
      setUser(data.user);
      await fetchProfile(data.user.id, data.user.user_metadata);
    }

    return data;
  };

  const register = async (email, password, fullName, role = 'CITIZEN') => {
    if (!isConfiguredSupabase()) {
      const newMockUser = {
        id: `user-${Date.now()}`,
        full_name: fullName || 'New Citizen',
        email: email,
        role: role,
        district: 'Ranchi',
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName || 'User')}`
      };
      localStorage.setItem('samadhan_mock_role', role);
      setUser({ id: newMockUser.id, email: newMockUser.email });
      setProfile(newMockUser);
      return { user: newMockUser };
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { 
          full_name: fullName, 
          role: role 
        }
      }
    });

    if (error) throw error;

    if (data.user) {
      setUser(data.user);
      await fetchProfile(data.user.id, { full_name: fullName, role, email });
    }

    return data;
  };

  const resetPassword = async (email) => {
    if (!isConfiguredSupabase()) {
      return { message: 'Password reset link simulated for demo.' };
    }
    const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/login`
    });
    if (error) throw error;
    return data;
  };

  const updateProfile = async (updates) => {
    if (!isConfiguredSupabase()) {
      const updated = { ...profile, ...updates };
      setProfile(updated);
      return updated;
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user?.id)
      .select()
      .single();

    if (error) throw error;
    setProfile(data);
    return data;
  };

  const logout = async () => {
    if (isConfiguredSupabase()) {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } else {
      localStorage.removeItem('samadhan_mock_role');
      simulateRole('CITIZEN');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      login, 
      register, 
      resetPassword,
      updateProfile,
      logout, 
      simulateRole,
      isConfigured: isConfiguredSupabase()
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
