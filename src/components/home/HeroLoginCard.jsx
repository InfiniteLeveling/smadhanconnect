import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldCheck, 
  Sparkles, 
  LogOut, 
  User, 
  Settings, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Building,
  KeyRound,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

export const HeroLoginCard = () => {
  const { 
    user, 
    profile, 
    signInWithGoogle, 
    signInWithGithub, 
    loginWithDemo, 
    logout, 
    isSuperAdmin,
    setNeedsRoleSelection
  } = useAuth();

  const [showDemoList, setShowDemoList] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingGithub, setLoadingGithub] = useState(false);

  const handleGoogle = async () => {
    setLoadingGoogle(true);
    await signInWithGoogle();
    setLoadingGoogle(false);
  };

  const handleGithub = async () => {
    setLoadingGithub(true);
    await signInWithGithub();
    setLoadingGithub(false);
  };

  const getRoleTheme = (role) => {
    switch (role) {
      case 'ADMIN':
        return { bg: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500', name: 'Super Admin / IT Cell' };
      case 'GOVERNMENT':
        return { bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500', name: 'Nodal Officer' };
      case 'STUDENT':
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', name: 'Student Innovator' };
      case 'UNIVERSITY':
        return { bg: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500', name: 'University / Mentor' };
      case 'INDUSTRY':
        return { bg: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500', name: 'Industry / CSR Sponsor' };
      default:
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', name: 'Citizen Member' };
    }
  };

  const roleMeta = getRoleTheme(profile?.role);

  return (
    <div className="w-full bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-200/50 relative overflow-hidden transition-all duration-300">
      
      {/* Decorative gradient corner */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand-100/60 to-transparent rounded-bl-full pointer-events-none" />

      {!profile ? (
        // =========================================================================
        // 1. UNAUTHENTICATED STATE: LOGIN / SIGN UP CARD
        // =========================================================================
        <div className="space-y-4 text-left">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 font-mono">
                Direct Portal Access
              </span>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-semibold">
              Supabase Auth
            </span>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 leading-tight">
              Sign In to Participate
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Login or create an account with Google or GitHub to report issues, propose tech solutions, or manage civic projects.
            </p>
          </div>

          {/* Social OAuth Buttons */}
          <div className="space-y-2.5 pt-1">
            {/* Google OAuth Button */}
            <button
              onClick={handleGoogle}
              disabled={loadingGoogle}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300/90 rounded-2xl text-xs font-bold shadow-xs hover:shadow-md hover:border-slate-400 transition-all duration-200 cursor-pointer group"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{loadingGoogle ? 'Connecting Google...' : 'Continue with Google'}</span>
            </button>

            {/* GitHub OAuth Button */}
            <button
              onClick={handleGithub}
              disabled={loadingGithub}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>{loadingGithub ? 'Connecting GitHub...' : 'Continue with GitHub'}</span>
            </button>
          </div>

          {/* Prompt Note */}
          <p className="text-[11px] text-slate-400 text-center">
            First time? You'll select your persona (Citizen, Student, University, Industry, Officer) right after sign-in.
          </p>

          {/* Quick Evaluator / Demo Login Accordion */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => setShowDemoList(!showDemoList)}
              className="w-full flex items-center justify-between text-[11px] font-bold text-slate-600 hover:text-brand-700 py-1 cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-brand-600" />
                Quick Dev & Evaluator Sign-In
              </span>
              <span className="text-[10px] text-slate-400">{showDemoList ? '▲ Hide' : '▼ View'}</span>
            </button>

            {showDemoList && (
              <div className="mt-2 space-y-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200/80 animate-in fade-in">
                <p className="text-[10px] font-semibold text-slate-500 mb-1">
                  1-Click Role Login for instant testing:
                </p>
                <button
                  onClick={() => loginWithDemo('microsoft1gab@gmail.com')}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-800 flex items-center justify-between"
                >
                  <span>👑 Super Admin (microsoft1gab@gmail.com)</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => loginWithDemo('user-citizen')}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-white text-slate-700 flex items-center justify-between"
                >
                  <span>👤 Ramesh Murmu (Citizen)</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => loginWithDemo('user-student')}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-white text-slate-700 flex items-center justify-between"
                >
                  <span>🎓 Pooja Kumari (Student Innovator)</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => loginWithDemo('user-gov')}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-white text-slate-700 flex items-center justify-between"
                >
                  <span>🛡️ Sanjay Tirkey (Nodal Officer)</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

        </div>
      ) : (
        // =========================================================================
        // 2. AUTHENTICATED STATE: ACTIVE USER PROFILE CARD
        // =========================================================================
        <div className="space-y-4 text-left">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${roleMeta.dot} animate-pulse`} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                Authenticated Session
              </span>
            </div>

            {isSuperAdmin && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                <Sparkles className="w-3 h-3 text-rose-600" />
                Primary Admin
              </span>
            )}
          </div>

          {/* Profile Header Block */}
          <div className="flex items-center gap-3.5">
            <img
              src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.email}`}
              alt={profile.full_name}
              className="w-12 h-12 rounded-2xl border-2 border-brand-500/40 bg-brand-50 shadow-sm shrink-0"
            />
            <div className="overflow-hidden">
              <p className="text-base font-bold text-slate-900 leading-tight truncate">
                {profile.full_name || profile.email}
              </p>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                {profile.email}
              </p>
            </div>
          </div>

          {/* Role & Location Badge */}
          <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Assigned Role:</span>
              <span className={`font-bold px-2 py-0.5 rounded-lg border text-[11px] font-mono ${roleMeta.bg}`}>
                {profile.role}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3 text-brand-600" /> District:
              </span>
              <span className="font-semibold text-slate-800">{profile.district || 'Ranchi'}</span>
            </div>

            {profile.organization && (
              <div className="flex items-center justify-between text-slate-600 truncate">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <Building className="w-3 h-3 text-brand-600" /> Org:
                </span>
                <span className="font-semibold text-slate-800 truncate max-w-[150px]">{profile.organization}</span>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="space-y-2 pt-1">
            {/* If Admin: Direct Admin Panel CTA */}
            {(profile.role === 'ADMIN' || isSuperAdmin) && (
              <Link to="/admin" className="block">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
                  <Settings className="w-3.5 h-3.5" />
                  <span>Open Admin Management Panel</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                </button>
              </Link>
            )}

            {/* If Govt/Admin: Nodal Triage CTA */}
            {(profile.role === 'GOVERNMENT' || profile.role === 'ADMIN') && (
              <Link to="/dashboard/government" className="block">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                  <span>Nodal Verification Triage</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto text-slate-400" />
                </button>
              </Link>
            )}

            {/* Report Problem Quick CTA */}
            <Link to="/report-problem" className="block">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200 rounded-xl text-xs font-bold transition-all cursor-pointer">
                <span>+ Report a Local Problem</span>
              </button>
            </Link>

            {/* Change Role / Edit Profile */}
            <button
              onClick={() => setNeedsRoleSelection(true)}
              className="w-full text-center text-[11px] font-semibold text-slate-500 hover:text-brand-700 py-1 transition-colors cursor-pointer"
            >
              Update Persona / Role Details
            </button>
          </div>

          {/* Footer & Logout */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={() => setShowDemoList(!showDemoList)}
              className="text-slate-500 hover:text-slate-800 font-medium text-[11px] cursor-pointer"
            >
              Switch Demo User
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-red-600 hover:text-red-700 font-bold text-xs cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

          {showDemoList && (
            <div className="space-y-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200/80 animate-in fade-in text-xs">
              <button
                onClick={() => loginWithDemo('microsoft1gab@gmail.com')}
                className="w-full text-left px-2 py-1 rounded text-xs font-bold text-rose-700 hover:bg-rose-50"
              >
                👑 Super Admin (microsoft1gab@gmail.com)
              </button>
              <button
                onClick={() => loginWithDemo('user-citizen')}
                className="w-full text-left px-2 py-1 rounded text-xs text-slate-700 hover:bg-white"
              >
                👤 Ramesh Murmu (Citizen)
              </button>
              <button
                onClick={() => loginWithDemo('user-student')}
                className="w-full text-left px-2 py-1 rounded text-xs text-slate-700 hover:bg-white"
              >
                🎓 Pooja Kumari (Student)
              </button>
              <button
                onClick={() => loginWithDemo('user-gov')}
                className="w-full text-left px-2 py-1 rounded text-xs text-slate-700 hover:bg-white"
              >
                🛡️ Sanjay Tirkey (Nodal Officer)
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
