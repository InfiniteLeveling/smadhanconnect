import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  UserCheck, 
  GraduationCap, 
  School, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  Sparkles,
  MapPin,
  Building,
  Phone,
  FileText
} from 'lucide-react';

const JHARKHAND_DISTRICTS = [
  'Ranchi', 'Dhanbad', 'East Singhbhum (Jamshedpur)', 'Bokaro', 'Deoghar', 
  'Hazaribagh', 'Giridih', 'Ramgarh', 'Palamu', 'West Singhbhum (Chaibasa)',
  'Dumka', 'Godda', 'Gumla', 'Garhwa', 'Chatra', 'Jamtara', 'Khunti',
  'Koderma', 'Latehar', 'Lohardaga', 'Pakur', 'Sahibganj', 'Seraikela Kharsawan', 'Simdega'
];

const ROLES_INFO = [
  {
    id: 'CITIZEN',
    title: 'Citizen',
    subtitle: 'Civic Member',
    description: 'Report local community problems, upload photographic evidence, and track real-time resolution by municipal bodies.',
    icon: UserCheck,
    color: 'from-blue-500 to-cyan-600',
    borderActive: 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/50',
    badge: 'Civic Reporter'
  },
  {
    id: 'STUDENT',
    title: 'Student Innovator',
    subtitle: 'College / University Student',
    description: 'Submit technical solutions, build AI/IoT prototypes, participate in problem sprints, and win development grants.',
    icon: GraduationCap,
    color: 'from-emerald-500 to-teal-600',
    borderActive: 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/50',
    badge: 'Innovator'
  },
  {
    id: 'UNIVERSITY',
    title: 'University / Faculty',
    subtitle: 'R&D Labs & Academic Mentors',
    description: 'Validate prototype feasibility, provide research guidance to student teams, and partner on state research initiatives.',
    icon: School,
    color: 'from-purple-500 to-indigo-600',
    borderActive: 'border-purple-500 ring-2 ring-purple-500/20 bg-purple-50/50',
    badge: 'Academic Lead'
  },
  {
    id: 'INDUSTRY',
    title: 'Industry / CSR',
    subtitle: 'Corporate Sponsor & Tech Adopter',
    description: 'Fund civic solutions via CSR grants, adopt scalable student prototypes, and offer pilot deployment sandboxes.',
    icon: Building2,
    color: 'from-amber-500 to-orange-600',
    borderActive: 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/50',
    badge: 'CSR Partner'
  },
  {
    id: 'GOVERNMENT',
    title: 'Nodal Officer',
    subtitle: 'Govt. Department Administrator',
    description: 'Triage reported citizen challenges, assign urgency tiers, verify evidence on ground, and allocate municipal resources.',
    icon: ShieldCheck,
    color: 'from-rose-500 to-red-600',
    borderActive: 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/50',
    badge: 'Govt. Official'
  }
];

export const RoleSelectionModal = () => {
  const { needsRoleSelection, updateUserRole, profile, user } = useAuth();

  const [selectedRole, setSelectedRole] = useState('CITIZEN');
  const [district, setDistrict] = useState('Ranchi');
  const [organization, setOrganization] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!needsRoleSelection) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateUserRole({
        role: selectedRole,
        district,
        organization,
        phone,
        bio
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentRoleObj = ROLES_INFO.find(r => r.id === selectedRole);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-brand-800 via-emerald-800 to-teal-800 text-white p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-2 text-brand-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Welcome to Samadhan Connect Onboarding</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
            Select Your Role & Profile Details
          </h2>
          <p className="text-slate-200 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Welcome, <span className="font-bold text-white">{profile?.full_name || user?.email}</span>! Please define how you will be engaging with Jharkhand's civic innovation ecosystem.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          
          {/* 1. ROLE SELECTION CARDS */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Step 1: Choose Your Persona <span className="text-red-500">*</span>
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {ROLES_INFO.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;

                return (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 text-left flex flex-col justify-between ${
                      isSelected 
                        ? role.borderActive + ' shadow-md scale-[1.01]' 
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${role.color} text-white flex items-center justify-center shadow-sm`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        {isSelected ? (
                          <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shadow-xs">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">
                            {role.badge}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm">{role.title}</h3>
                      <p className="text-[11px] font-medium text-slate-500">{role.subtitle}</p>
                      
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {role.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. PROFILE DETAILS */}
          <div className="pt-2 border-t border-slate-100 space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Step 2: Key Profile Details
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* District Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-600" />
                  Primary District in Jharkhand <span className="text-red-500">*</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                  required
                >
                  {JHARKHAND_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Organization / College / Department */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-brand-600" />
                  {selectedRole === 'STUDENT' ? 'University / College Name' : 
                   selectedRole === 'UNIVERSITY' ? 'Institution / Department' : 
                   selectedRole === 'INDUSTRY' ? 'Company / CSR Foundation' : 
                   selectedRole === 'GOVERNMENT' ? 'Govt. Department / Office' : 'Community / Ward / Locality'}
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder={
                    selectedRole === 'STUDENT' ? 'e.g., BIT Mesra, Ranchi' :
                    selectedRole === 'UNIVERSITY' ? 'e.g., IIT ISM Dhanbad' :
                    selectedRole === 'INDUSTRY' ? 'e.g., Tata Steel CSR' :
                    selectedRole === 'GOVERNMENT' ? 'e.g., Ranchi Municipal Corporation' : 'e.g., Harmu Housing Colony'
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>

              {/* Phone (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-brand-600" />
                  Contact Number (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>

              {/* Short Bio / Intent */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-brand-600" />
                  Short Bio or Civic Objective
                </label>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="e.g., Interested in water conservation and rural energy projects."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>

            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Selected Role: <span className="font-bold text-slate-900">{currentRoleObj?.title}</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 via-emerald-600 to-teal-600 shadow-lg shadow-brand-600/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Saving Profile...' : 'Complete Onboarding & Enter Platform'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
