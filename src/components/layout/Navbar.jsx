import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getNotifications, markNotificationsAsRead } from '../../services/dataService';
import { Button } from '../ui/Button';
import { 
  Sparkles, 
  Compass, 
  Rocket, 
  ShieldCheck, 
  MessageSquare, 
  Bell, 
  PlusCircle, 
  Menu, 
  X,
  CheckCheck,
  ExternalLink,
  TrendingUp,
  GraduationCap,
  Building2
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
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-7 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-700 to-emerald-500 flex items-center justify-center text-white font-display font-extrabold shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                SC
              </div>
              <div>
                <span className="text-lg font-extrabold font-display tracking-tight text-slate-900 block leading-tight">
                  SAMADHAN<span className="text-brand-600">.CONNECT</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block -mt-0.5">
                  Govt of Jharkhand
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            <Link to="/report-problem" className="hidden sm:inline-block">
              <Button size="sm" variant="primary" icon={PlusCircle}>
                Report Problem
              </Button>
            </Link>

            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="relative p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Drawer Dropdown */}
              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200/80 p-4 space-y-3 animate-in zoom-in-95 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">Notifications</span>
                      <span className="bg-brand-100 text-brand-800 text-xs px-2 py-0.5 rounded-full font-bold">
                        {unreadCount} new
                      </span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1"
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
                              ? 'bg-brand-50/50 border-brand-200/60 text-slate-900'
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
              <div className="hidden lg:flex items-center gap-2.5 pl-3 border-l border-slate-200">
                <img
                  src={profile.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo'}
                  alt={profile.full_name}
                  className="w-8 h-8 rounded-full border border-brand-400/50 bg-slate-100"
                />
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                    {profile.full_name}
                  </p>
                  <p className="text-[10px] font-mono text-brand-600 font-bold uppercase">
                    {profile.role}
                  </p>
                </div>
              </div>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100"
            >
              <link.icon className="w-4 h-4 text-brand-600" />
              <span>{link.name}</span>
            </Link>
          ))}
          <div className="pt-2">
            <Link to="/report-problem" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full" variant="primary">Report Problem</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
