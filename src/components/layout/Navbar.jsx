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
  ChevronDown
} from 'lucide-react';

export const Navbar = () => {
  const { profile } = useAuth();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showSecondaryMenu, setShowSecondaryMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showTourModal, setShowTourModal] = useState(false);

  // Auto-launch onboarding tour on first visit
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('samadhan_onboarding_seen');
    if (!hasSeenTour) {
      // Short delay for smooth entrance
      const timer = setTimeout(() => {
        setShowTourModal(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const loadNotifs = async () => {
    try {
      const data = await getNotifications(profile?.id);
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadNotifs();
  }, [profile]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAllRead = async () => {
    await markNotificationsAsRead(profile?.id);
    await loadNotifs();
  };

  // 1. PRIMARY NAVIGATION (Most Prominent Actions)
  const primaryNavLinks = [
    { 
      name: 'Explore Challenges', 
      path: '/challenges', 
      icon: Compass,
      tooltip: 'Browse real civic problems across 24 districts'
    },
    { 
      name: 'Workspace', 
      path: '/projects/proj-001', 
      icon: Rocket,
      tooltip: 'Track active 5-phase projects and IoT telemetry'
    },
    { 
      name: 'Analytics', 
      path: '/analytics', 
      icon: TrendingUp,
      tooltip: 'View civic trends, district density & platform insights'
    }
  ];

  // 2. SECONDARY ECOSYSTEM HUBS
  const secondaryNavLinks = [
    { 
      name: 'Universities', 
      path: '/universities', 
      icon: GraduationCap,
      tooltip: 'Academic R&D and student research hubs'
    },
    { 
      name: 'Industry / CSR', 
      path: '/industries', 
      icon: Building2,
      tooltip: 'Connect corporate sponsors with civic projects'
    },
    { 
      name: 'Messaging', 
      path: '/messages', 
      icon: MessageSquare,
      tooltip: 'Communicate with project collaborators'
    }
  ];

  // Role-gated Nodal Queue
  const isGovernment = profile?.role === 'GOVERNMENT' || profile?.role === 'ADMIN';

  return (
    <>
      <nav className="bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-xs sticky top-0 sm:top-0 z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left Section: Brand Logo + Primary Nav */}
            <div className="flex items-center gap-6">
              {/* Brand Logo */}
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-700 via-emerald-600 to-teal-500 flex items-center justify-center text-white font-display font-extrabold shadow-md shadow-brand-600/25 group-hover:scale-105 transition-all duration-300">
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

              {/* Desktop Primary Navigation */}
              <div className="hidden lg:flex items-center gap-1.5 pl-2 border-l border-slate-200/70">
                {primaryNavLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <Tooltip key={link.path} content={link.tooltip} position="bottom">
                      <Link
                        to={link.path}
                        className={`group relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                          isActive
                            ? 'bg-brand-50 text-brand-700 border border-brand-200/80 shadow-xs ring-1 ring-brand-500/10'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 ${isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-brand-600'}`} />
                        <span>{link.name}</span>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-pulse" />
                        )}
                      </Link>
                    </Tooltip>
                  );
                })}

                {/* Secondary Ecosystem Hubs Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowSecondaryMenu(!showSecondaryMenu)}
                    onMouseEnter={() => setShowSecondaryMenu(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-colors cursor-pointer"
                  >
                    <span>More Hubs</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {showSecondaryMenu && (
                    <div
                      onMouseLeave={() => setShowSecondaryMenu(false)}
                      className="absolute top-full left-0 mt-1 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/90 p-2 space-y-1 z-50 animate-in fade-in zoom-in-95"
                    >
                      {secondaryNavLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path;
                        return (
                          <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setShowSecondaryMenu(false)}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                              isActive
                                ? 'bg-brand-50 text-brand-700'
                                : 'text-slate-700 hover:bg-slate-100 hover:text-brand-700'
                            }`}
                          >
                            <Icon className="w-4 h-4 text-brand-600" />
                            <div>
                              <p className="leading-tight">{link.name}</p>
                              <p className="text-[10px] text-slate-400 font-normal truncate mt-0.5">{link.tooltip.split(' ')[0]} {link.tooltip.split(' ')[1]}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Government Nodal Queue (If Govt/Admin) */}
                {isGovernment && (
                  <Tooltip content="Verify citizen reports & assign urgency" position="bottom">
                    <Link
                      to="/dashboard/government"
                      className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        location.pathname === '/dashboard/government'
                          ? 'bg-brand-50 text-brand-700 border border-brand-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-600 group-hover:-translate-y-0.5 transition-transform" />
                      <span>Nodal Triage</span>
                    </Link>
                  </Tooltip>
                )}
              </div>
            </div>

            {/* Right Controls: Report Problem CTA + Notifications + Help + Persona */}
            <div className="flex items-center gap-2.5">
              
              {/* Strongest CTA: + Report Problem Button */}
              <Tooltip content="Have a civic issue? Report it here." position="bottom">
                <Link to="/report-problem" className="hidden sm:inline-block">
                  <button className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 via-emerald-600 to-teal-600 shadow-md shadow-brand-600/25 hover:shadow-lg hover:shadow-brand-500/35 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden">
                    <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <PlusCircle className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" />
                    <span>Report Problem</span>
                  </button>
                </Link>
              </Tooltip>

              {/* Need Help? Quick Guide Button */}
              <Tooltip content="Platform guide & FAQ" position="bottom">
                <button
                  onClick={() => setShowHelpModal(true)}
                  className="p-2 rounded-xl text-slate-600 hover:text-brand-700 hover:bg-brand-50/80 border border-slate-200/80 hover:border-brand-200 transition-all flex items-center gap-1 text-xs font-bold cursor-pointer"
                  title="Need Help?"
                >
                  <HelpCircle className="w-4 h-4 text-brand-600" />
                  <span className="hidden md:inline">Help</span>
                </button>
              </Tooltip>

              {/* Notification Bell with Dropdown */}
              <div className="relative">
                <Tooltip content="View recent notifications" position="bottom">
                  <button
                    onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                    className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100/90 transition-all cursor-pointer"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </Tooltip>

                {/* Notification Dropdown Drawer */}
                {showNotifDropdown && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/90 p-4 space-y-3 animate-in zoom-in-95 z-50">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 font-display">Notifications</span>
                        <span className="bg-brand-100 text-brand-800 text-xs px-2 py-0.5 rounded-full font-bold">
                          {unreadCount} new
                        </span>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                        </button>
                      )}
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

              {/* Persona Quick Card or Sign In Link */}
              {profile ? (
                <Tooltip content="Active Persona • Click to Switch" position="bottom">
                  <Link 
                    to="/login"
                    className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-slate-200 hover:opacity-85 transition-opacity"
                  >
                    <img
                      src={profile.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo'}
                      alt={profile.full_name}
                      className="w-8 h-8 rounded-full border border-brand-400/60 bg-slate-100 shadow-xs"
                    />
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                        {profile.full_name}
                      </p>
                      <p className="text-[10px] font-mono text-brand-600 font-bold uppercase tracking-tight">
                        {profile.role}
                      </p>
                    </div>
                  </Link>
                </Tooltip>
              ) : (
                <Link to="/login" className="hidden sm:inline-block">
                  <button className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors">
                    Sign In
                  </button>
                </Link>
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

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 py-4 space-y-2 animate-in slide-in-from-top-2">
            
            {/* Primary Links */}
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 pt-1">
              Primary Navigation
            </p>
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
                className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-2"
              >
                <HelpCircle className="w-4 h-4 text-brand-600" />
                <span>Need Help? Platform Guide</span>
              </button>

              <Link to="/report-problem" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-emerald-600 shadow-md shadow-brand-600/25 flex items-center justify-center gap-2">
                  <PlusCircle className="w-4 h-4" />
                  <span>Report Problem</span>
                </button>
              </Link>
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
