import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getNotifications, markNotificationsAsRead } from '../../services/dataService';
import { Tooltip } from '../ui/Tooltip';
import { OnboardingGuideModal } from '../ui/OnboardingGuideModal';
import { HelpPanelModal } from '../ui/HelpPanelModal';
import { 
  Compass, 
  Rocket, 
  ShieldCheck, 
  MessageSquare, 
  Bell, 
  PlusCircle, 
  Menu, 
  X, 
  CheckCheck, 
  TrendingUp, 
  GraduationCap, 
  Building2, 
  HelpCircle,
  Sparkles,
  ChevronDown,
  Crown,
  LogOut,
  User,
  Settings,
  LogIn,
  Bot,
  MapPin,
  Building,
  RefreshCw,
  ArrowRight
} from 'lucide-react';

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

export const Navbar = () => {
  const { profile, user, logout, setNeedsRoleSelection, signInWithGoogle, isSuperAdmin, loginWithDemo } = useAuth();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showSecondaryMenu, setShowSecondaryMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showDemoSwitch, setShowDemoSwitch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showTourModal, setShowTourModal] = useState(false);

  // Auto-launch onboarding tour on first visit
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('samadhan_tour_seen');
    if (!hasSeenTour) {
      const timer = setTimeout(() => {
        setShowTourModal(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (profile) {
      loadNotifications();
    }
  }, [profile]);

  const loadNotifications = async () => {
    if (!profile?.id) return;
    const data = await getNotifications(profile.id);
    setNotifications(data || []);
  };

  const handleMarkAllAsRead = async () => {
    if (!profile?.id) return;
    await markNotificationsAsRead(profile.id);
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const isAdmin = profile?.role === 'ADMIN' || isSuperAdmin;
  const isGovernment = profile?.role === 'GOVERNMENT';
  const roleMeta = getRoleTheme(profile?.role);

  // Primary Navigation Links (Pinned Samadhan AI)
  const primaryNavLinks = [
    {
      name: 'Challenges',
      path: '/challenges',
      icon: Compass,
      tooltip: 'Browse active civic problems & engineering challenges'
    },
    {
      name: 'Samadhan AI',
      path: '/messages',
      icon: Bot,
      tooltip: '25-Domain Civic AI Assistant (Google Gemini 2.5 Pro)',
      badge: 'AI'
    },
    {
      name: 'Workspace',
      path: '/projects/proj-001',
      icon: Rocket,
      tooltip: '5-Phase Prototype Kanban & Telemetry Lab'
    },
    {
      name: 'Analytics',
      path: '/analytics',
      icon: TrendingUp,
      tooltip: 'District-level metrics, resolution SLA & density trends'
    }
  ];

  // Secondary Ecosystem Hub Links
  const secondaryNavLinks = [
    {
      name: 'Universities & Labs',
      path: '/universities',
      icon: GraduationCap,
      description: 'Academic R&D cells, mentoring & patents'
    },
    {
      name: 'Industry CSR Grants',
      path: '/industries',
      icon: Building2,
      description: 'Corporate funding & commercial sandbox pilots'
    }
  ];

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-xs transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* 1. BRAND LOGO */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-700 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-brand-600/20 group-hover:scale-105 group-hover:shadow-brand-600/30 transition-all duration-200">
                  <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg font-display group-hover:text-brand-700 transition-colors">
                      Samadhan<span className="text-brand-600">.Connect</span>
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-brand-50 text-brand-700 border border-brand-200/80 font-bold hidden sm:inline-block">
                      JH-GOV
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium -mt-1 hidden sm:block">
                    Civic Problem Solving & Prototype Hub
                  </p>
                </div>
              </Link>
            </div>

            {/* 2. DESKTOP PRIMARY NAVIGATION LINKS */}
            <div className="hidden lg:flex items-center gap-1.5">
              {primaryNavLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Tooltip key={link.path} text={link.tooltip} position="bottom">
                    <Link
                      to={link.path}
                      className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 ${
                        isActive
                          ? 'bg-brand-50 text-brand-800 font-extrabold shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-brand-700' : 'text-slate-500'}`} />
                      <span>{link.name}</span>
                      
                      {/* Special AI Badge for Chatbot */}
                      {link.badge && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-mono font-bold shadow-2xs animate-pulse">
                          {link.badge}
                        </span>
                      )}

                      {/* Active Indicator Dot */}
                      {isActive && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-600" />
                      )}
                    </Link>
                  </Tooltip>
                );
              })}

              {/* Ecosystem Dropdown Menu */}
              <div 
                className="relative"
                onMouseEnter={() => setShowSecondaryMenu(true)}
                onMouseLeave={() => setShowSecondaryMenu(false)}
              >
                <button
                  onClick={() => setShowSecondaryMenu(!showSecondaryMenu)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    location.pathname.startsWith('/universities') || location.pathname.startsWith('/industries')
                      ? 'bg-brand-50 text-brand-800'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <span>Ecosystem</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${showSecondaryMenu ? 'rotate-180' : ''}`} />
                </button>

                {showSecondaryMenu && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/90 p-2 space-y-1 z-50 animate-in fade-in zoom-in-95">
                    {secondaryNavLinks.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setShowSecondaryMenu(false)}
                          className={`flex items-start gap-2.5 p-2.5 rounded-xl transition-all ${
                            isActive ? 'bg-brand-50 text-brand-800' : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5 text-brand-600">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold">{item.name}</p>
                            <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{item.description}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* District Nodal / Admin Direct Tabs */}
              {isGovernment && (
                <Link
                  to="/dashboard/government"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    location.pathname.startsWith('/dashboard/government')
                      ? 'bg-amber-100 text-amber-900 shadow-xs'
                      : 'text-amber-800 hover:bg-amber-50'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Nodal Portal</span>
                </Link>
              )}

              {isAdmin && (
                <Link
                  to="/admin"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    location.pathname.startsWith('/admin')
                      ? 'bg-rose-100 text-rose-900 shadow-xs'
                      : 'text-rose-700 hover:bg-rose-50'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5 text-rose-600" />
                  <span>Admin Panel</span>
                </Link>
              )}
            </div>

            {/* 3. RIGHT CONTROLS: HELP TOUR + REPORT PROBLEM + NOTIFICATIONS + USER PROFILE */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Quick Help Guide Button */}
              <Tooltip text="Platform Guide & Interactive Tour" position="bottom">
                <button
                  onClick={() => setShowHelpModal(true)}
                  className="p-2 rounded-xl text-slate-500 hover:text-brand-700 hover:bg-brand-50/80 transition-colors cursor-pointer"
                  aria-label="Platform Help Guide"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </Tooltip>

              {/* Fast Action: Report Problem Button */}
              <Link to="/report-problem" className="hidden sm:inline-block">
                <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-700 to-emerald-600 shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 cursor-pointer">
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Report Problem</span>
                </button>
              </Link>

              {/* Notification Bell Dropdown */}
              <div className="relative">
                <Tooltip text="Real-time Platform Notifications" position="bottom">
                  <button
                    onClick={() => {
                      setShowNotifDropdown(!showNotifDropdown);
                      if (!showNotifDropdown && unreadCount > 0) {
                        handleMarkAllAsRead();
                      }
                    }}
                    className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 transition-colors cursor-pointer"
                    aria-label="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
                    )}
                  </button>
                </Tooltip>

                {showNotifDropdown && (
                  <div
                    onMouseLeave={() => setShowNotifDropdown(false)}
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/90 p-4 space-y-3 z-50 animate-in fade-in zoom-in-95 text-left"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 font-mono font-bold">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-[11px] text-brand-600 hover:text-brand-800 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCheck className="w-3 h-3" />
                        <span>Mark read</span>
                      </button>
                    </div>

                    <div className="space-y-2 max-h-72 overflow-y-auto no-scrollbar">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-6">No notifications</p>
                      ) : (
                        notifications.map((n) => (
                          <Link
                            key={n.id}
                            to={n.link || '#'}
                            onClick={() => setShowNotifDropdown(false)}
                            className={`block p-3 rounded-xl border text-xs transition-colors ${
                              !n.is_read
                                ? 'bg-brand-50/60 border-brand-200/70 text-slate-900'
                                : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <p className="font-bold">{n.title}</p>
                            <p className="text-slate-500 mt-0.5 leading-relaxed">{n.content}</p>
                            <span className="text-[10px] text-slate-400 block mt-1.5">
                              {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 4. USER AUTH & PERSONA DROPDOWN (Enriched Profile Card) */}
              {profile ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-2xl hover:bg-slate-100/80 border border-slate-200/70 transition-all cursor-pointer group"
                  >
                    <img
                      src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.email}`}
                      alt={profile.full_name}
                      className="w-8 h-8 rounded-full border border-brand-400/60 bg-slate-100 shadow-xs"
                    />
                    <div className="hidden sm:block text-left">
                      <div className="flex items-center gap-1">
                        <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[100px]">
                          {profile.full_name?.split(' ')[0] || 'User'}
                        </p>
                        {isAdmin && <Crown className="w-3 h-3 text-amber-500" />}
                      </div>
                      <p className="text-[9px] font-mono text-brand-600 font-bold uppercase tracking-tight">
                        {profile.role}
                      </p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                  </button>

                  {/* Profile Dropdown Menu with Complete Profile Card */}
                  {showUserDropdown && (
                    <div
                      className="absolute right-0 mt-2 w-80 sm:w-88 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200/90 p-5 space-y-4 z-50 animate-in fade-in zoom-in-95 text-left"
                    >
                      {/* 1. Header: Session Indicator + Admin Pill */}
                      <div className="flex items-center justify-between pb-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${roleMeta.dot} animate-pulse`} />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                            Authenticated Session
                          </span>
                        </div>

                        {isSuperAdmin && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 font-mono">
                            <Crown className="w-3 h-3 text-rose-600" />
                            Primary Admin
                          </span>
                        )}
                      </div>

                      {/* 2. User Avatar & Info */}
                      <div className="flex items-center gap-3.5 pb-2 border-b border-slate-100">
                        <img
                          src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.email}`}
                          alt={profile.full_name}
                          className="w-12 h-12 rounded-2xl border-2 border-brand-500/40 bg-brand-50 shadow-sm shrink-0"
                        />
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold text-slate-900 leading-tight truncate">
                            {profile.full_name || profile.email}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono truncate mt-0.5">
                            {profile.email}
                          </p>
                        </div>
                      </div>

                      {/* 3. Role, District, Organization Box */}
                      <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-medium">Assigned Role:</span>
                          <span className={`font-bold px-2.5 py-0.5 rounded-lg border text-[11px] font-mono ${roleMeta.bg}`}>
                            {profile.role}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-slate-600">
                          <span className="text-slate-500 font-medium flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-brand-600" /> District:
                          </span>
                          <span className="font-semibold text-slate-800">{profile.district || 'Ranchi'}</span>
                        </div>

                        {profile.organization && (
                          <div className="flex items-center justify-between text-slate-600 truncate">
                            <span className="text-slate-500 font-medium flex items-center gap-1">
                              <Building className="w-3.5 h-3.5 text-brand-600" /> Org:
                            </span>
                            <span className="font-semibold text-slate-800 truncate max-w-[150px]">{profile.organization}</span>
                          </div>
                        )}
                      </div>

                      {/* 4. Action CTAs */}
                      <div className="space-y-2 pt-1">
                        {/* If Admin: Direct Admin Panel CTA */}
                        {(profile.role === 'ADMIN' || isSuperAdmin) && (
                          <Link 
                            to="/admin" 
                            onClick={() => setShowUserDropdown(false)}
                            className="block"
                          >
                            <button className="w-full flex items-center justify-between px-3.5 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all cursor-pointer">
                              <div className="flex items-center gap-2">
                                <Crown className="w-4 h-4" />
                                <span>Admin Management Panel</span>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </Link>
                        )}

                        {/* If Govt/Admin: Nodal Triage CTA */}
                        {(profile.role === 'GOVERNMENT' || profile.role === 'ADMIN') && (
                          <Link 
                            to="/dashboard/government" 
                            onClick={() => setShowUserDropdown(false)}
                            className="block"
                          >
                            <button className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer">
                              <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                <span>Nodal Verification Triage</span>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                          </Link>
                        )}

                        {/* Report Problem Quick CTA */}
                        <Link 
                          to="/report-problem" 
                          onClick={() => setShowUserDropdown(false)}
                          className="block"
                        >
                          <button className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200 rounded-xl text-xs font-bold transition-all cursor-pointer">
                            <PlusCircle className="w-4 h-4 text-brand-600" />
                            <span>+ Report a Local Problem</span>
                          </button>
                        </Link>

                        {/* Change Role / Edit Profile */}
                        <button
                          onClick={() => {
                            setShowUserDropdown(false);
                            setNeedsRoleSelection(true);
                          }}
                          className="w-full flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-slate-600 hover:text-brand-700 py-1.5 rounded-lg hover:bg-slate-100/80 transition-colors cursor-pointer"
                        >
                          <Settings className="w-3.5 h-3.5 text-slate-500" />
                          <span>Update Persona / Role Details</span>
                        </button>
                      </div>

                      {/* 5. Switch Demo User Accordion & Sign Out */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <button
                          onClick={() => setShowDemoSwitch(!showDemoSwitch)}
                          className="text-slate-500 hover:text-slate-900 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className={`w-3 h-3 ${showDemoSwitch ? 'rotate-180' : ''} transition-transform`} />
                          <span>Switch Demo User</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowUserDropdown(false);
                            logout();
                          }}
                          className="flex items-center gap-1.5 text-red-600 hover:text-red-700 font-bold text-xs cursor-pointer hover:underline"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>

                      {showDemoSwitch && (
                        <div className="space-y-1.5 p-2 bg-slate-50 rounded-2xl border border-slate-200/80 animate-in fade-in text-xs">
                          <button
                            onClick={() => {
                              loginWithDemo('microsoft1gab@gmail.com');
                              setShowUserDropdown(false);
                            }}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-700 hover:bg-rose-50 flex items-center justify-between cursor-pointer"
                          >
                            <span>👑 Super Admin</span>
                            <span className="text-[10px] text-slate-400 font-mono">microsoft1gab</span>
                          </button>
                          <button
                            onClick={() => {
                              loginWithDemo('user-citizen');
                              setShowUserDropdown(false);
                            }}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-white flex items-center justify-between cursor-pointer"
                          >
                            <span>👤 Ramesh Murmu</span>
                            <span className="text-[10px] text-slate-400 font-mono">Citizen</span>
                          </button>
                          <button
                            onClick={() => {
                              loginWithDemo('user-student');
                              setShowUserDropdown(false);
                            }}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-white flex items-center justify-between cursor-pointer"
                          >
                            <span>🎓 Pooja Kumari</span>
                            <span className="text-[10px] text-slate-400 font-mono">Student</span>
                          </button>
                          <button
                            onClick={() => {
                              loginWithDemo('user-government');
                              setShowUserDropdown(false);
                            }}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-white flex items-center justify-between cursor-pointer"
                          >
                            <span>🛡️ Rajesh Verma</span>
                            <span className="text-[10px] text-slate-400 font-mono">Nodal Officer</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={signInWithGoogle}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-brand-600" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Mobile Menu Trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100/80 transition-colors"
                title="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* 5. MOBILE DRAWER NAVIGATION */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-xl p-4 space-y-3 animate-in slide-in-from-top-2 text-left">
            {primaryNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl text-sm font-bold transition-colors ${
                  location.pathname === link.path
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <link.icon className="w-4 h-4 text-brand-600" />
                <div className="text-left">
                  <p>{link.name}</p>
                  <p className="text-[10px] text-slate-400 font-normal">{link.tooltip}</p>
                </div>
              </Link>
            ))}

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 p-2.5 rounded-xl text-sm font-bold text-rose-700 bg-rose-50"
              >
                <Crown className="w-4 h-4 text-rose-600" />
                <span>Admin Management Panel</span>
              </Link>
            )}

            {/* Secondary Ecosystem Links */}
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 pt-2">
              Ecosystem Hubs
            </p>
            {secondaryNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl text-sm font-bold transition-colors ${
                  location.pathname === link.path
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <link.icon className="w-4 h-4 text-brand-600" />
                <span>{link.name}</span>
              </Link>
            ))}

            {/* Mobile Actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowHelpModal(true);
                }}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-brand-600" />
                <span>Need Help? Platform Guide</span>
              </button>

              <Link to="/report-problem" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-emerald-600 shadow-md shadow-brand-600/25 flex items-center justify-center gap-2 cursor-pointer">
                  <PlusCircle className="w-4 h-4" />
                  <span>Report Problem</span>
                </button>
              </Link>

              {profile && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Global Interactive Onboarding Tour Modal */}
      <OnboardingGuideModal
        isOpen={showTourModal}
        onClose={() => setShowTourModal(false)}
      />

      {/* Global Help Panel Modal */}
      <HelpPanelModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        onOpenTour={() => setShowTourModal(true)}
      />
    </>
  );
};
