import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CivicNetworkCanvas } from '../components/home/CivicNetworkCanvas';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  Users, 
  GraduationCap, 
  Building2, 
  Rocket, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  KeyRound,
  Fingerprint,
  Check,
  Building,
  MapPin,
  HelpCircle
} from 'lucide-react';

const ECOSYSTEM_ROLES = [
  {
    id: 'CITIZEN',
    name: 'Citizen',
    description: 'Report issues and track your complaints',
    icon: Users,
    defaultEmail: 'ramesh@example.com',
    targetRoute: '/challenges',
    badgeColor: 'from-emerald-500 to-teal-600',
    tag: 'Public Access'
  },
  {
    id: 'GOVERNMENT',
    name: 'Government / Department',
    description: 'Review and manage civic issues',
    icon: ShieldCheck,
    defaultEmail: 'sanjay.t@jharkhand.gov.in',
    targetRoute: '/dashboard/government',
    badgeColor: 'from-green-600 to-emerald-700',
    tag: 'Nodal Officer'
  },
  {
    id: 'UNIVERSITY',
    name: 'University',
    description: 'Collaborate on civic projects & R&D',
    icon: GraduationCap,
    defaultEmail: 'arvind@iitism.ac.in',
    targetRoute: '/universities',
    badgeColor: 'from-teal-600 to-brand-600',
    tag: 'Research Hub'
  },
  {
    id: 'INDUSTRY',
    name: 'Industry / CSR',
    description: 'Support and fund civic initiatives',
    icon: Building2,
    defaultEmail: 'vikram@tatasteel.com',
    targetRoute: '/industries',
    badgeColor: 'from-emerald-700 to-teal-800',
    tag: 'CSR Partner'
  },
  {
    id: 'STUDENT',
    name: 'Innovator',
    description: 'Propose technology-based solutions',
    icon: Rocket,
    defaultEmail: 'pooja@student.bitmesra.ac.in',
    targetRoute: '/projects/proj-001',
    badgeColor: 'from-brand-600 to-emerald-500',
    tag: 'Solution Builder'
  }
];

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, resetPassword } = useAuth();

  const [selectedRole, setSelectedRole] = useState(ECOSYSTEM_ROLES[0]);
  const [email, setEmail] = useState('ramesh@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [showGovSsoModal, setShowGovSsoModal] = useState(false);

  // Switch role and update default email
  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setEmail(role.defaultEmail);
    setErrorMessage('');
    setInfoMessage('');
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setErrorMessage('Please enter your email address to receive password reset instructions.');
      return;
    }
    try {
      await resetPassword(email);
      setInfoMessage(`Password reset instructions have been sent to ${email}. Please check your inbox.`);
      setErrorMessage('');
    } catch (err) {
      setErrorMessage(err.message || 'Unable to send password reset email.');
    }
  };

  const validateForm = () => {
    if (!email.trim()) {
      setErrorMessage('Please enter your email or mobile number.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    if (!emailRegex.test(email.trim()) && !phoneRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address (e.g. name@example.com) or 10-digit mobile number.');
      return false;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await login(email, password, selectedRole.id);
      setIsLoading(false);
      setIsSuccess(true);

      // Smooth transition before navigation to role dashboard
      setTimeout(() => {
        navigate(selectedRole.targetRoute);
      }, 700);
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(
        err.message?.includes('Invalid login credentials') 
          ? "We couldn't sign you in. Please check your email/mobile number and password."
          : (err.message || "We couldn't sign you in. Please check your credentials and try again.")
      );
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50/90 text-slate-900 flex flex-col justify-between overflow-x-hidden select-none">
      
      {/* ========================================================================= */}
      {/* 3D ANIMATED BACKGROUND CANVAS (Layered Depth & Connected Civic Nodes)      */}
      {/* ========================================================================= */}
      <CivicNetworkCanvas className="h-full min-h-screen -z-0 opacity-70" />

      {/* Layered Ambient Light Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-brand-100/30 via-emerald-50/15 to-transparent pointer-events-none -z-10" />

      {/* ========================================================================= */}
      {/* TOP BRANDING BAR & BACK LINK                                              */}
      {/* ========================================================================= */}
      <header className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        {/* Official Brand Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-xl"
          aria-label="Samadhan Connect Home"
        >
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-700 via-emerald-600 to-teal-500 flex items-center justify-center text-white font-display font-extrabold shadow-md shadow-brand-600/25 group-hover:scale-105 transition-transform duration-300">
            SC
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-brand-400 border-2 border-white ring-1 ring-brand-500/30" />
          </div>
          <div>
            <span className="text-lg font-extrabold font-display tracking-tight text-slate-900 block leading-tight">
              SAMADHAN<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-emerald-600">.CONNECT</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block -mt-0.5">
              Govt of Jharkhand
            </span>
          </div>
        </Link>

        {/* Back to Home Link */}
        <Link
          to="/"
          className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-xs hover:text-brand-700 hover:border-brand-300 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1 text-slate-400 group-hover:text-brand-600" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* ========================================================================= */}
      {/* MAIN AUTHENTICATION CONTAINER (Elevated 3D Card Architecture)             */}
      {/* ========================================================================= */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-10">
        <div className="w-full max-w-xl">
          
          {/* Layered 3D Glassmorphism Authentication Card */}
          <div className="relative bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-2xl shadow-emerald-950/10 p-6 sm:p-9 transition-all duration-300">
            
            {/* Top Accent Brand Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-600 via-emerald-500 to-teal-500 rounded-t-3xl" />

            {/* Header: Official Shield & Welcoming Heading */}
            <div className="text-center space-y-2 mb-6">
              <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-brand-50 to-emerald-100/70 border border-brand-200/80 text-brand-700 shadow-xs mb-1">
                <KeyRound className="w-6 h-6 animate-pulse" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
                Welcome Back
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-sm mx-auto">
                Secure access to the <span className="font-semibold text-slate-700">Samadhan.Connect</span> civic problem-solving ecosystem
              </p>
            </div>

            {/* Accessible Live Error Alert */}
            {errorMessage && (
              <div 
                role="alert" 
                aria-live="polite"
                className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in-50"
              >
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p className="font-medium leading-relaxed">{errorMessage}</p>
              </div>
            )}

            {/* Info Message Banner */}
            {infoMessage && (
              <div 
                role="status" 
                aria-live="polite"
                className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-800 animate-in fade-in-50 font-medium"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{infoMessage}</p>
              </div>
            )}

            {/* Success Animation Banner */}
            {isSuccess && (
              <div 
                role="status" 
                aria-live="polite"
                className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center gap-2.5 text-xs text-emerald-800 font-bold animate-in zoom-in-95"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 animate-bounce" />
                <span>Authenticated Successfully! Opening {selectedRole.name} workspace...</span>
              </div>
            )}

            {/* =================================================================== */}
            {/* 1. PERSONA SELECTION ("How are you using Samadhan.Connect?")         */}
            {/* =================================================================== */}
            <div className="space-y-2.5 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <label id="persona-label" className="text-xs font-bold font-display uppercase tracking-wider text-slate-700">
                    How are you using Samadhan.Connect?
                  </label>
                  <p className="text-[11px] text-slate-400 font-normal">
                    Select your profile to access your dedicated workspace
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200/60 shrink-0">
                  {selectedRole.name.split(' ')[0]}
                </span>
              </div>

              {/* 5 Selectable 3D Profile Cards */}
              <div 
                role="radiogroup" 
                aria-labelledby="persona-label"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1"
              >
                {ECOSYSTEM_ROLES.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole.id === role.id;

                  return (
                    <button
                      key={role.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => handleSelectRole(role)}
                      className={`group relative p-2.5 rounded-2xl border text-left transition-all duration-200 flex items-start gap-2.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                        isSelected
                          ? 'bg-brand-50/90 border-brand-500 ring-2 ring-brand-500/25 shadow-xs scale-[1.02]'
                          : 'bg-white/70 border-slate-200/80 hover:bg-white hover:border-brand-300 hover:shadow-xs'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isSelected 
                          ? `bg-gradient-to-br ${role.badgeColor} text-white shadow-xs` 
                          : 'bg-slate-100 text-slate-500 group-hover:bg-brand-100 group-hover:text-brand-700'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className={`text-xs font-bold truncate leading-tight ${isSelected ? 'text-brand-950' : 'text-slate-800'}`}>
                            {role.name}
                          </p>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-brand-600 shrink-0 ml-1" />
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {role.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Contextual Persona Confirmation Badge */}
              <div className="p-2.5 bg-brand-50/60 border border-brand-100 rounded-xl flex items-center justify-between text-[11px] text-brand-900 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-pulse" />
                  You're signing in as: <strong>{selectedRole.name}</strong>
                </span>
                <span className="text-[10px] text-brand-700/80 font-mono">
                  {selectedRole.tag}
                </span>
              </div>
            </div>

            {/* =================================================================== */}
            {/* 2. LOGIN CREDENTIAL FORM (Google/Gemini Familiar UX)                */}
            {/* =================================================================== */}
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Email / Mobile Input */}
              <div className="space-y-1.5 text-left">
                <label 
                  htmlFor="email-input" 
                  className="block text-xs font-bold text-slate-700"
                >
                  Email or mobile number
                </label>
                <div className="relative rounded-2xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="email-input"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email or mobile number"
                    autoComplete="username"
                    disabled={isLoading || isSuccess}
                    className="block w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 bg-white border border-slate-200 rounded-2xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* Password Input with Eye Toggle */}
              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <label 
                    htmlFor="password-input" 
                    className="block text-xs font-bold text-slate-700"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[11px] font-bold text-brand-700 hover:text-brand-800 hover:underline focus:outline-none focus-visible:ring-1 focus-visible:ring-brand-500 rounded cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative rounded-2xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={isLoading || isSuccess}
                    className="block w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 bg-white border border-slate-200 rounded-2xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1 text-left">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 accent-brand-600 cursor-pointer"
                  />
                  <span className="text-xs text-slate-600 font-medium">Remember me on this device</span>
                </label>
              </div>

              {/* Primary Submit Button ("Sign In as [Role] →") */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || isSuccess}
                  className="group relative w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-brand-700 via-emerald-600 to-teal-600 shadow-lg shadow-brand-600/25 hover:shadow-xl hover:shadow-brand-500/35 hover:scale-[1.01] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 transition-all duration-300 cursor-pointer disabled:opacity-75 disabled:pointer-events-none overflow-hidden"
                >
                  <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing you in...</span>
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Authenticated!</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In as {selectedRole.name}</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* =================================================================== */}
            {/* 3. ALTERNATIVE GOVERNMENT SSO LOGIN                                 */}
            {/* =================================================================== */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block">
                or continue with
              </span>

              <button
                type="button"
                onClick={() => setShowGovSsoModal(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl text-xs font-bold text-slate-700 bg-white border border-slate-200 shadow-xs hover:bg-slate-50 hover:border-brand-300 hover:text-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 transition-all cursor-pointer"
              >
                <Fingerprint className="w-4 h-4 text-brand-600" />
                <span>Continue with Government ID (Parichay / Jan Parichay)</span>
              </button>
            </div>

            {/* =================================================================== */}
            {/* 4. REGISTRATION LINK & SECURITY BADGE                               */}
            {/* =================================================================== */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-center space-y-3">
              <p className="text-xs text-slate-500 font-medium">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-bold text-brand-700 hover:text-brand-800 hover:underline inline-flex items-center gap-0.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-brand-500 rounded"
                >
                  Create Account <ArrowRight className="w-3 h-3 ml-0.5" />
                </Link>
              </p>

              {/* Security Indicator */}
              <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>Your information is securely protected</span>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* GOVERNMENT SSO MODAL                                                      */}
      {/* ========================================================================= */}
      {showGovSsoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700">
                <Fingerprint className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-base text-slate-900 font-display">
                  National / State SSO Gateway
                </h3>
                <p className="text-xs text-slate-500">Government of Jharkhand Integration</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed text-left">
              Integration ready for <strong>MeriPehchaan</strong> & <strong>Jan Parichay SSO</strong> for verified state departmental nodal officers. Use the <em>Government / Department</em> persona role on this page for live simulation.
            </p>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowGovSsoModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* OFFICIAL GOVERNMENT FOOTER ACCENT                                         */}
      {/* ========================================================================= */}
      <footer className="relative z-10 py-4 border-t border-slate-200/80 text-center text-[11px] text-slate-400">
        <span>Samadhan.Connect • Department of Information Technology & e-Governance, Govt. of Jharkhand</span>
      </footer>

    </div>
  );
};
