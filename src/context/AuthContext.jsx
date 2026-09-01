import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isConfiguredSupabase } from '../services/supabase';
import { MOCK_PROFILES } from '../data/mockDatabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth
  useEffect(() => {
    // If Supabase is NOT configured (offline/demo mode), auto-login as Citizen
    if (!isConfiguredSupabase()) {
      console.warn("Supabase not configured. Using mock offline authentication.");
      const mockCitizen = MOCK_PROFILES.find(p => p.role === 'CITIZEN');
      setUser({ id: mockCitizen.id, email: mockCitizen.email });
      setProfile(mockCitizen);
      setLoading(false);
      return;
    }

    // Real Supabase Auth Flow
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      }
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
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

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error.message);
    }
  };

  // 1-Click Role Switcher for SIH Demo
  const simulateRole = (role) => {
    const mockUser = MOCK_PROFILES.find(p => p.role === role);
    if (mockUser) {
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
      setUser({ id: matchedProfile.id, email: matchedProfile.email });
      setProfile(matchedProfile);
      return { user: matchedProfile, session: { user: matchedProfile } };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const register = async (email, password, fullName, role) => {
    if (!isConfiguredSupabase()) {
      const newMockUser = {
        id: `user-${Date.now()}`,
        full_name: fullName || 'New Citizen',
        email: email,
        role: role || 'CITIZEN',
        district: 'Ranchi',
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName || 'User')}`
      };
      setUser({ id: newMockUser.id, email: newMockUser.email });
      setProfile(newMockUser);
      return { user: newMockUser };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role: role }
      }
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    if (isConfiguredSupabase()) {
      await supabase.auth.signOut();
    } else {
      // Offline mode logout just defaults back to Citizen
      simulateRole('CITIZEN');
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout, simulateRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
