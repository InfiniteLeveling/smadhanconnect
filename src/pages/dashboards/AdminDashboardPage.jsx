import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllProfiles, updateUserProfileRole, updateProfileVerification } from '../../services/dataService';
import { 
  ShieldCheck, 
  Users, 
  Crown, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  UserPlus, 
  Activity, 
  GraduationCap, 
  Building2, 
  School, 
  UserCheck, 
  AlertCircle,
  RefreshCw,
  Check,
  ChevronDown
} from 'lucide-react';

const ROLES_LIST = [
  { id: 'CITIZEN', label: 'Citizen', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'STUDENT', label: 'Student Innovator', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'UNIVERSITY', label: 'University / Faculty', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'INDUSTRY', label: 'Industry / CSR', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'GOVERNMENT', label: 'Nodal Officer', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  { id: 'ADMIN', label: 'System Admin', color: 'bg-red-100 text-red-800 border-red-300 font-bold' }
];

export const AdminDashboardPage = () => {
  const { profile: currentAdmin, SUPER_ADMIN_EMAIL } = useAuth();
  
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');
  const [actionNotice, setActionNotice] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllProfiles();
      setProfiles(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showToast = (message, type = 'success') => {
    setActionNotice({ message, type });
    setTimeout(() => {
      setActionNotice(null);
    }, 4000);
  };

  const handleRoleChange = async (userId, userEmail, newRole) => {
    setProcessingId(userId);
    try {
      const result = await updateUserProfileRole(userId, newRole);
      if (result.success) {
        setProfiles(prev => prev.map(p => 
          (p.id === userId || p.email === userEmail) ? { ...p, role: newRole } : p
        ));
        showToast(`Successfully updated role for ${userEmail} to ${newRole}!`);
      } else {
        showToast(result.error || 'Failed to update user role', 'error');
      }
    } catch (err) {
      showToast('Error executing role promotion', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleVerificationToggle = async (userId, currentStatus) => {
    setProcessingId(userId);
    const nextStatus = !currentStatus;
    try {
      const result = await updateProfileVerification(userId, nextStatus);
      if (result.success) {
        setProfiles(prev => prev.map(p => 
          p.id === userId ? { ...p, verification_status: nextStatus } : p
        ));
        showToast(`Updated verification status to ${nextStatus ? 'Verified' : 'Unverified'}`);
      }
    } catch (err) {
      showToast('Failed to toggle verification status', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  // Filter logic
  const filteredUsers = profiles.filter(user => {
    const matchesRole = selectedRoleFilter === 'ALL' || user.role === selectedRoleFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      user.full_name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.organization?.toLowerCase().includes(query) ||
      user.district?.toLowerCase().includes(query);
    return matchesRole && matchesSearch;
  });

  // Calculate statistics
  const stats = {
    total: profiles.length,
    admins: profiles.filter(p => p.role === 'ADMIN').length,
    citizens: profiles.filter(p => p.role === 'CITIZEN').length,
    students: profiles.filter(p => p.role === 'STUDENT').length,
    universities: profiles.filter(p => p.role === 'UNIVERSITY').length,
    industries: profiles.filter(p => p.role === 'INDUSTRY').length,
    officers: profiles.filter(p => p.role === 'GOVERNMENT').length,
    verified: profiles.filter(p => p.verification_status).length,
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Toast Notification Alert */}
        {actionNotice && (
          <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-xl flex items-center gap-3 border animate-in slide-in-from-bottom-5 ${
            actionNotice.type === 'success' 
              ? 'bg-emerald-900 text-white border-emerald-700' 
              : 'bg-red-900 text-white border-red-700'
          }`}>
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold">{actionNotice.message}</span>
          </div>
        )}

        {/* Top Header & Super Admin Badge */}
        <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-widest font-mono">
                  <Crown className="w-3.5 h-3.5 text-rose-400" />
                  Primary Super Admin Portal
                </span>
                <span className="text-xs text-slate-400 font-mono">Govt. of Jharkhand IT Cell</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight">
                User Role Administration & Governance
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Empower platform users by assigning administrative privileges, promoting citizens or officers to Admins, and managing departmental verification across Jharkhand.
              </p>
            </div>

            {/* Current Active Admin Pill */}
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-3 shrink-0">
              <img
                src={currentAdmin?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'}
                alt="Admin"
                className="w-10 h-10 rounded-xl border border-rose-400/60 bg-slate-800"
              />
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-white leading-tight">
                    {currentAdmin?.full_name || 'Admin'}
                  </p>
                  <Crown className="w-3 h-3 text-amber-400" />
                </div>
                <p className="text-[11px] text-slate-300 font-mono">
                  {currentAdmin?.email}
                </p>
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                  Super Administrator
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-left">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Total Users</span>
              <Users className="w-4 h-4 text-brand-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 font-display">{stats.total}</p>
            <span className="text-[10px] text-slate-400">Platform members</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-xs text-left">
            <div className="flex items-center justify-between text-rose-500 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Admins</span>
              <Crown className="w-4 h-4 text-rose-600" />
            </div>
            <p className="text-2xl font-extrabold text-rose-900 font-display">{stats.admins}</p>
            <span className="text-[10px] text-rose-600 font-medium">Full governance</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-left">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Citizens</span>
              <UserCheck className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 font-display">{stats.citizens}</p>
            <span className="text-[10px] text-slate-400">Reporters & Voters</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-left">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Students</span>
              <GraduationCap className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 font-display">{stats.students}</p>
            <span className="text-[10px] text-slate-400">Innovators</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-left">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Universities</span>
              <School className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 font-display">{stats.universities}</p>
            <span className="text-[10px] text-slate-400">R&D Hubs</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-left">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Industry</span>
              <Building2 className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 font-display">{stats.industries}</p>
            <span className="text-[10px] text-slate-400">CSR Funders</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-left">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Nodal Officers</span>
              <ShieldCheck className="w-4 h-4 text-red-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 font-display">{stats.officers}</p>
            <span className="text-[10px] text-slate-400">Govt. Triage</span>
          </div>

        </div>

        {/* User Management Table Section */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          
          {/* Controls Bar: Search & Filter */}
          <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user by name, email, district..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold shrink-0">
                <Filter className="w-3.5 h-3.5 text-brand-600" />
                <span>Filter Role:</span>
              </div>

              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
              >
                <option value="ALL">All Roles ({profiles.length})</option>
                <option value="ADMIN">System Admins ({stats.admins})</option>
                <option value="GOVERNMENT">Nodal Officers ({stats.officers})</option>
                <option value="CITIZEN">Citizens ({stats.citizens})</option>
                <option value="STUDENT">Students ({stats.students})</option>
                <option value="UNIVERSITY">Universities ({stats.universities})</option>
                <option value="INDUSTRY">Industry ({stats.industries})</option>
              </select>

              <button
                onClick={fetchUsers}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors cursor-pointer"
                title="Refresh user list"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-6">User / Member</th>
                  <th className="py-3.5 px-6">District & Org</th>
                  <th className="py-3.5 px-6">Current Role</th>
                  <th className="py-3.5 px-6">Verification</th>
                  <th className="py-3.5 px-6 text-right">Promote / Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-slate-400">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mb-2" />
                      <p>Loading registered platform users...</p>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-slate-400">
                      <p className="font-semibold">No users matching search criteria.</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const isSuper = user.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
                    const isProcessing = processingId === user.id;

                    return (
                      <tr key={user.id || user.email} className="hover:bg-slate-50/80 transition-colors">
                        
                        {/* User Column */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                              alt={user.full_name}
                              className="w-10 h-10 rounded-full border border-slate-200 bg-slate-100 shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900">{user.full_name || 'Member'}</span>
                                {isSuper && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                                    <Crown className="w-3 h-3 text-rose-600" />
                                    Super Admin
                                  </span>
                                )}
                              </div>
                              <span className="text-slate-400 text-[11px] font-mono block mt-0.5">{user.email}</span>
                            </div>
                          </div>
                        </td>

                        {/* District & Org Column */}
                        <td className="py-4 px-6 text-slate-600">
                          <p className="font-medium text-slate-800">{user.district || 'Ranchi'}</p>
                          <p className="text-[11px] text-slate-400 truncate max-w-[180px]">
                            {user.organization || 'General Public'}
                          </p>
                        </td>

                        {/* Current Role Column */}
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border font-mono ${
                            ROLES_LIST.find(r => r.id === user.role)?.color || 'bg-slate-100 text-slate-700'
                          }`}>
                            {user.role === 'ADMIN' && <Crown className="w-3 h-3 text-rose-600" />}
                            {user.role}
                          </span>
                        </td>

                        {/* Verification Column */}
                        <td className="py-4 px-6">
                          <button
                            onClick={() => handleVerificationToggle(user.id, user.verification_status)}
                            disabled={isProcessing || isSuper}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                              user.verification_status
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {user.verification_status ? (
                              <>
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Verified</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5 text-slate-400" />
                                <span>Unverified</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Role Change / Promotion Dropdown */}
                        <td className="py-4 px-6 text-right">
                          {isSuper ? (
                            <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">
                              Locked (Super Admin)
                            </span>
                          ) : (
                            <div className="inline-flex items-center gap-2">
                              <select
                                value={user.role}
                                onChange={(e) => handleRoleChange(user.id, user.email, e.target.value)}
                                disabled={isProcessing}
                                className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs cursor-pointer disabled:opacity-50"
                              >
                                {ROLES_LIST.map((r) => (
                                  <option key={r.id} value={r.id}>
                                    {r.id === 'ADMIN' ? '👑 Make Admin' : `Change to ${r.label}`}
                                  </option>
                                ))}
                              </select>

                              {user.role !== 'ADMIN' && (
                                <button
                                  onClick={() => handleRoleChange(user.id, user.email, 'ADMIN')}
                                  disabled={isProcessing}
                                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center gap-1"
                                  title="Quick Promote to System Admin"
                                >
                                  <Crown className="w-3.5 h-3.5" />
                                  <span>Make Admin</span>
                                </button>
                              )}
                            </div>
                          )}
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing {filteredUsers.length} of {profiles.length} registered users</span>
            <span>Designated Super Admin: <strong className="text-slate-800">{SUPER_ADMIN_EMAIL}</strong></span>
          </div>

        </div>

      </div>
    </div>
  );
};
