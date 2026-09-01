import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getNotifications, markNotificationsAsRead } from '../../services/dataService';
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
  ArrowUpRight
} from 'lucide-react';

export const Navbar = () => {
  const { profile } = useAuth();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const navLinks = [
    { name: 'Explore Challenges', path: '/challenges', icon: Compass },
    { name: 'Analytics', path: '/analytics', icon: TrendingUp },
    { name: '5-Phase Workspace', path: '/projects/proj-001', icon: Rocket },
    { name: 'Universities', path: '/universities', icon: GraduationCap },
    { name: 'Industry CSR', path: '/industries', icon: Building2 },
    { name: 'Messaging', path: '/messages', icon: MessageSquare }
  ];

  if (profile?.role === 'GOVERNMENT' || profile?.role === 'ADMIN') {
    navLinks.push({ name: 'Nodal Triage Queue', path: '/dashboard/government', icon: ShieldCheck });
  }

  return (
    <nav className="bg-white/85 backdrop-blur-xl border-b border-slate-200/70 shadow-sm sticky top-0 sm:top-0 z-40 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-700 via-emerald-600 to-teal-500 flex items-center justify-center text-white font-display font-extrabold shadow-md shadow-brand-600/25 group-hover:scale-105 group-hover:shadow-brand-500/35 transition-all duration-300">
                SC
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-brand-400 border-2 border-white ring-1 ring-brand-500/30" />
              </div>
              <div>
                <span className="text-lg font-extrabold font-display tracking-tight text-slate-900 block leading-tight group-hover:text-slate-800 transition-colors">
                  SAMADHAN<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-emerald-600">.CONNECT</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block -mt-0.5">
                  Govt of Jharkhand
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-brand-50/90 text-brand-700 border border-brand-200/70 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 ${isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-brand-600'}`} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Report Problem Action Button */}
            <Link to="/report-problem" className="hidden sm:inline-block">
              <button className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 via-emerald-600 to-teal-600 shadow-md shadow-brand-600/25 hover:shadow-lg hover:shadow-brand-500/35 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden">
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <PlusCircle className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" />
                <span>Report Problem</span>
              </button>
            </Link>

            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="relative p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100/90 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-5 h-5 transition-transform duration-200" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Drawer Dropdown */}
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

                  <div className="space-y-2 max-h-72 overflow-y-auto">
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

            {/* Persona Quick Card */}
            {profile && (
              <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-slate-200">
                <img
                  src={profile.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo'}
                  alt={profile.full_name}
                  className="w-8 h-8 rounded-full border border-brand-400/60 bg-slate-100 shadow-sm"
                />
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                    {profile.full_name}
                  </p>
                  <p className="text-[10px] font-mono text-brand-600 font-bold uppercase tracking-tight">
                    {profile.role}
                  </p>
                </div>
              </div>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100/80 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 py-4 space-y-2 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
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
          <div className="pt-2">
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
  );
};
