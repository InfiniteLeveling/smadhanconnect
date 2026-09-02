import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isConfiguredSupabase } from '../services/supabase';
import { getUserProfile, saveUserProfile } from '../services/dataService';
import { MOCK_PROFILES } from '../data/mockDatabase';

const AuthContext = createContext();

const SUPER_ADMIN_EMAIL = 'microsoft1gab@gmail.com';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false);

  // Helper to load or initialize profile from user
  const syncProfile = async (authUser) => {
    if (!authUser) {
      setUser(null);
      setProfile(null);
      setNeedsRoleSelection(false);
      setLoading(false);
      return;
    }

    setUser(authUser);

    const isSuperAdmin = authUser.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

    // Try fetching existing profile
    let userProfile = await getUserProfile(authUser.id);

    if (userProfile) {
      // If super admin email, enforce ADMIN role
      if (isSuperAdmin && userProfile.role !== 'ADMIN') {
        userProfile = { ...userProfile, role: 'ADMIN', verification_status: true };
        await saveUserProfile(userProfile);
      }
      setProfile(userProfile);

      // Check if user needs role selection (if not super admin and no explicit role chosen)
      const hasChosenRole = localStorage.getItem(`samadhan_role_selected_${authUser.id}`) || 
                            userProfile.role_selected || 
                            isSuperAdmin;
      
      if (!hasChosenRole) {
        setNeedsRoleSelection(true);
      } else {
        setNeedsRoleSelection(false);
      }
    } else {
      // First time user profile creation
      const fullName = authUser.user_metadata?.full_name || 
                        authUser.user_metadata?.name || 
                        authUser.email?.split('@')[0] || 
                        'Civic Member';
      
      const avatarUrl = authUser.user_metadata?.avatar_url || 
                         authUser.user_metadata?.picture || 
                         `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser.id}`;

      const newProfile = {
        id: authUser.id,
        email: authUser.email,
        full_name: fullName,
        avatar_url: avatarUrl,
        role: isSuperAdmin ? 'ADMIN' : 'CITIZEN',
        district: 'Ranchi',
        verification_status: isSuperAdmin,
        role_selected: isSuperAdmin // Super admin doesn't need to choose
      };

      await saveUserProfile(newProfile);
      setProfile(newProfile);

      if (!isSuperAdmin) {
        setNeedsRoleSelection(true);
      } else {
        setNeedsRoleSelection(false);
      }
    }

    setLoading(false);
  };

  // Initialize Auth & listen to Supabase auth state changes
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        if (isConfiguredSupabase()) {
          const { data: { session } } = await supabase.auth.getSession();
          if (mounted) {
            if (session?.user) {
              await syncProfile(session.user);
            } else {
              // Default to null or check local stored demo session
              const storedDemo = localStorage.getItem('samadhan_demo_user');
              if (storedDemo) {
                const parsed = JSON.parse(storedDemo);
                setUser(parsed.user);
                setProfile(parsed.profile);
              }
              setLoading(false);
            }
          }

          // Subscribe to auth state changes
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
              if (mounted) {
                if (session?.user) {
                  await syncProfile(session.user);
                } else {
                  // If logged out from supabase, check if demo mode was set
                  const storedDemo = localStorage.getItem('samadhan_demo_user');
                  if (!storedDemo) {
                    setUser(null);
                    setProfile(null);
                    setNeedsRoleSelection(false);
                  }
                  setLoading(false);
                }
              }
            }
          );

          return () => {
            subscription?.unsubscribe();
          };
        } else {
          // Offline / Local development fallback
          const storedDemo = localStorage.getItem('samadhan_demo_user');
          if (storedDemo) {
            const parsed = JSON.parse(storedDemo);
            setUser(parsed.user);
            setProfile(parsed.profile);
          } else {
            // Default demo citizen
            const defaultUser = MOCK_PROFILES[0];
            setUser({ id: defaultUser.id, email: defaultUser.email });
            setProfile(defaultUser);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // 1. Google OAuth
  const signInWithGoogle = async () => {
    try {
      if (!isConfiguredSupabase()) {
        // Fallback simulate login for demo
        loginWithDemo(SUPER_ADMIN_EMAIL);
        return { success: true };
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Google Sign In Error:', error);
      alert('Google Sign In note: ' + (error.message || 'Please check Supabase Google provider credentials.'));
      return { success: false, error };
    }
  };

  // 2. GitHub OAuth
  const signInWithGithub = async () => {
    try {
      if (!isConfiguredSupabase()) {
        loginWithDemo('user-citizen');
        return { success: true };
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('GitHub Sign In Error:', error);
      alert('GitHub Sign In note: ' + (error.message || 'Please check Supabase GitHub provider credentials.'));
      return { success: false, error };
    }
  };

  // 3. Complete Role Onboarding Choice
  const updateUserRole = async ({ role, organization, district, phone, bio }) => {
    if (!profile) return;

    const updatedProfile = {
      ...profile,
      role: role || profile.role || 'CITIZEN',
      organization: organization || profile.organization || '',
      district: district || profile.district || 'Ranchi',
      phone: phone || profile.phone || '',
      bio: bio || profile.bio || '',
      role_selected: true,
      updated_at: new Date().toISOString()
    };

    // If super admin email, always ensure ADMIN role
    if (profile.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
      updatedProfile.role = 'ADMIN';
      updatedProfile.verification_status = true;
    }

    setProfile(updatedProfile);
    setNeedsRoleSelection(false);

    if (user?.id) {
      localStorage.setItem(`samadhan_role_selected_${user.id}`, 'true');
    }

    await saveUserProfile(updatedProfile);
  };

  // 4. Quick Demo Login Switcher (for SIH testing and evaluator verification)
  const loginWithDemo = (identifier) => {
    let matched = MOCK_PROFILES.find(p => p.id === identifier || p.email === identifier || p.role === identifier);
    if (!matched) {
      matched = MOCK_PROFILES[0];
    }

    const demoUser = { id: matched.id, email: matched.email };
    setUser(demoUser);
    setProfile(matched);
    setNeedsRoleSelection(false);
    localStorage.setItem('samadhan_demo_user', JSON.stringify({ user: demoUser, profile: matched }));
  };

  // 5. Sign Out
  const logout = async () => {
    try {
      localStorage.removeItem('samadhan_demo_user');
      if (isConfiguredSupabase()) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setProfile(null);
      setNeedsRoleSelection(false);
    }
  };

  const isSuperAdmin = profile?.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase() || profile?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        needsRoleSelection,
        setNeedsRoleSelection,
        signInWithGoogle,
        signInWithGithub,
        updateUserRole,
        loginWithDemo,
        logout,
        isSuperAdmin,
        SUPER_ADMIN_EMAIL
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

