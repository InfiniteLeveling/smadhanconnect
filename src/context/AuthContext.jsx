import React, { createContext, useContext, useState } from 'react';
import { MOCK_PROFILES } from '../data/mockDatabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const defaultCitizen = MOCK_PROFILES.find(p => p.role === 'CITIZEN') || MOCK_PROFILES[0];
  const [user, setUser] = useState({ id: defaultCitizen.id, email: defaultCitizen.email });
  const [profile, setProfile] = useState(defaultCitizen);
  const [loading, setLoading] = useState(false);

  // 1-Click Role Switcher for SIH & Platform Exploration
  const simulateRole = (role) => {
    const matchedUser = MOCK_PROFILES.find(p => p.role === role);
    if (matchedUser) {
      setUser({ id: matchedUser.id, email: matchedUser.email });
      setProfile(matchedUser);
    }
  };

  const login = async () => {
    return { user: profile, session: { user: profile } };
  };

  const logout = async () => {
    simulateRole('CITIZEN');
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout, simulateRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
