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

  const login = async (email, password) => {
    if (!isConfiguredSupabase()) throw new Error("Offline mode: Use the top bar to switch roles.");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const register = async (email, password, fullName, role) => {
    if (!isConfiguredSupabase()) throw new Error("Offline mode: Cannot register new users.");
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
