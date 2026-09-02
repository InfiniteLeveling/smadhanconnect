import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDistricts } from '../services/dataService';
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
  User,
  Phone,
  MapPin,
  Building,
  Check,
  Sparkles,
  UserPlus
} from 'lucide-react';

const ECOSYSTEM_ROLES = [
  {
    id: 'CITIZEN',
    name: 'Citizen',
    description: 'Report civic issues and track resolutions',
    icon: Users,
    targetRoute: '/challenges',
    badgeColor: 'from-emerald-500 to-teal-600',
    orgLabel: 'Locality / Area Name (Optional)',
    orgPlaceholder: 'e.g. Ward 4, Lesliganj'
  },
  {
    id: 'STUDENT',
    name: 'Innovator',
    description: 'Propose technical prototypes & solutions',
    icon: Rocket,
    targetRoute: '/projects/proj-001',
    badgeColor: 'from-brand-600 to-emerald-500',
    orgLabel: 'College / University / Startup Name',
    orgPlaceholder: 'e.g. BIT Mesra Innovation Lab'
  },
  {
    id: 'GOVERNMENT',
    name: 'Government / Nodal',
    description: 'Review, verify & manage civic issues',
    icon: ShieldCheck,
    targetRoute: '/dashboard/government',
    badgeColor: 'from-green-600 to-emerald-700',
    orgLabel: 'Government Department / Directorate',
    orgPlaceholder: 'e.g. Urban Development & Housing Dept.'
  },
  {
    id: 'UNIVERSITY',
    name: 'University',
    description: 'Academic R&D labs and faculty research',
    icon: GraduationCap,
    targetRoute: '/universities',
    badgeColor: 'from-teal-600 to-brand-600',
    orgLabel: 'Institution / Research Center Name',
    orgPlaceholder: 'e.g. IIT (ISM) Dhanbad'
  },
  {
    id: 'INDUSTRY',
    name: 'Industry / CSR',
    description: 'Sponsor & fund impactful civic solutions',
    icon: Building2,
    targetRoute: '/industries',
    badgeColor: 'from-emerald-700 to-teal-800',
    orgLabel: 'Company / CSR Foundation Name',
    orgPlaceholder: 'e.g. Tata Steel CSR Foundation'
  }
];

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [districts, setDistricts] = useState([]);
  const [selectedRole, setSelectedRole] = useState(ECOSYSTEM_ROLES[0]);
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('Ranchi');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Load Jharkhand districts
  useEffect(() => {
    const loadDistricts = async () => {
      try {
        const data = await getDistricts();
        setDistricts(data);
      } catch (err) {
        console.error('Error loading districts:', err);
      }
    };
    loadDistricts();
  }, []);

  const validateForm = () => {
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return false;
    }
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address (e.g. name@example.com).');
      return false;
    }
    if (phone.trim()) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(phone.trim())) {
        setErrorMessage('Please enter a valid 10-digit mobile number.');
        return false;
      }
    }
    if (!password) {
      setErrorMessage('Please create a password for your account.');
      return false;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return false;
    }
    if (!agreeTerms) {
      setErrorMessage('Please accept the Terms of Service to create your account.');
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await register(
        email.trim(),
        password,
        fullName.trim(),
        selectedRole.id,
        {
          phone: phone.trim(),
          district: selectedDistrict,
          organization: organization.trim()
        }
      );

      setIsLoading(false);
      setIsSuccess(true);

      // Smooth transition before navigation to role workspace
      setTimeout(() => {
        navigate(selectedRole.targetRoute);
      }, 1000);
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Registration failed. Please check your details and try again.');
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50/90 text-slate-900 flex flex-col justify-between overflow-x-hidden select-none">
      
      {/* 3D Animated Background Canvas */}
      <CivicNetworkCanvas className="h-full min-h-screen -z-0 opacity-70" />

      {/* Ambient Light Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-brand-100/30 via-emerald-50/15 to-transparent pointer-events-none -z-10" />

      {/* Top Header & Branding */}
      <header className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
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

        {/* Link back to Sign In */}
        <Link
          to="/login"
          className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-xs hover:text-brand-700 hover:border-brand-300 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 transition-all duration-200"
        >
          <span>Already registered? Sign In</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-600 transition-colors" />
        </Link>
      </header>

      {/* Main Registration Form Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-10">
        <div className="w-full max-w-2xl">
          
          {/* Elevated 3D Glassmorphism Card */}
          <div className="relative bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-2xl shadow-emerald-950/10 p-6 sm:p-9 transition-all duration-300">
            
            {/* Top Accent Gradient Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-600 via-emerald-500 to-teal-500 rounded-t-3xl" />

            {/* Header */}
            <div className="text-center space-y-2 mb-6">
              <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-brand-50 to-emerald-100/70 border border-brand-200/80 text-brand-700 shadow-xs mb-1">
                <UserPlus className="w-6 h-6 animate-pulse" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
                Create Your Account
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto">
                Join Jharkhand's civic innovation ecosystem to report issues, build solutions, or sponsor projects.
              </p>
            </div>

            {/* Live Error Alert */}
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

            {/* Success Banner */}
            {isSuccess && (
              <div 
                role="status" 
                aria-live="polite"
                className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center gap-2.5 text-xs text-emerald-800 font-bold animate-in zoom-in-95"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 animate-bounce" />
                <span>Account Created Successfully! Opening {selectedRole.name} workspace...</span>
              </div>
            )}

            {/* 1. Profile Persona Selector */}
            <div className="space-y-2.5 mb-6 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <label id="register-persona-label" className="text-xs font-bold font-display uppercase tracking-wider text-slate-700">
                    How will you use Samadhan.Connect?
                  </label>
                  <p className="text-[11px] text-slate-400 font-normal">
                    Select your profile type to configure your workspace permissions
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200/60 shrink-0">
                  {selectedRole.name}
                </span>
              </div>

              <div 
                role="radiogroup" 
                aria-labelledby="register-persona-label"
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
                      onClick={() => {
                        setSelectedRole(role);
                        setErrorMessage('');
                      }}
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
            </div>

            {/* 2. Registration Form */}
            <form onSubmit={handleRegister} className="space-y-4 text-left">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-2xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ramesh Murmu"
                      required
                      disabled={isLoading || isSuccess}
                      className="block w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 bg-white border border-slate-200 rounded-2xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all shadow-xs"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-2xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      autoComplete="username"
                      required
                      disabled={isLoading || isSuccess}
                      className="block w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 bg-white border border-slate-200 rounded-2xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all shadow-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Mobile Number */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Mobile Number (Optional)
                  </label>
                  <div className="relative rounded-2xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="h-4 w-4" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      disabled={isLoading || isSuccess}
                      className="block w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 bg-white border border-slate-200 rounded-2xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all shadow-xs"
                    />
                  </div>
                </div>

                {/* District Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    District <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-2xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      disabled={isLoading || isSuccess}
                      className="block w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all shadow-xs appearance-none cursor-pointer"
                    >
                      {districts.map((d) => (
                        <option key={d.id || d.name} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Organization / Department / College Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  {selectedRole.orgLabel}
                </label>
                <div className="relative rounded-2xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Building className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder={selectedRole.orgPlaceholder}
                    disabled={isLoading || isSuccess}
                    className="block w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 bg-white border border-slate-200 rounded-2xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-2xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      autoComplete="new-password"
                      required
                      disabled={isLoading || isSuccess}
                      className="block w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 bg-white border border-slate-200 rounded-2xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-2xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      autoComplete="new-password"
                      required
                      disabled={isLoading || isSuccess}
                      className="block w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 bg-white border border-slate-200 rounded-2xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all shadow-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Agree Terms Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="agree-terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 accent-brand-600 cursor-pointer"
                />
                <label htmlFor="agree-terms" className="text-xs text-slate-600 font-medium cursor-pointer">
                  I agree to the <span className="text-slate-900 font-bold">Terms of Service</span> and <span className="text-slate-900 font-bold">Privacy Policy</span> of Samadhan.Connect
                </label>
              </div>

              {/* Submit CTA Button */}
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
                      <span>Creating your account...</span>
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Account Created!</span>
                    </>
                  ) : (
                    <>
                      <span>Register as {selectedRole.name}</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Bottom Footer & Links */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-center space-y-2">
              <p className="text-xs text-slate-500 font-medium">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-bold text-brand-700 hover:text-brand-800 hover:underline inline-flex items-center gap-0.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-brand-500 rounded"
                >
                  Sign In <ArrowRight className="w-3 h-3 ml-0.5" />
                </Link>
              </p>
            </div>

          </div>
        </div>
      </main>

      {/* Official Government Footer */}
      <footer className="relative z-10 py-4 border-t border-slate-200/80 text-center text-[11px] text-slate-400">
        <span>Samadhan.Connect • Department of Information Technology & e-Governance, Govt. of Jharkhand</span>
      </footer>

    </div>
  );
};
