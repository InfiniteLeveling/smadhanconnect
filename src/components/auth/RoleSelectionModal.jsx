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
  FileText,
  X
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
    description: 'Report local community problems, upload photo evidence, and track municipal resolution.',
    icon: UserCheck,
    color: 'from-blue-500 to-cyan-600',
    borderActive: 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/50',
    badge: 'Civic Reporter'
  },
  {
    id: 'STUDENT',
    title: 'Student Innovator',
    subtitle: 'College / University Student',
    description: 'Submit technical solutions, build AI/IoT prototypes, and win development grants.',
    icon: GraduationCap,
    color: 'from-emerald-500 to-teal-600',
    borderActive: 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/50',
    badge: 'Innovator'
  },
  {
    id: 'UNIVERSITY',
    title: 'University / Faculty',
    subtitle: 'R&D Labs & Mentors',
    description: 'Validate prototype feasibility, guide student teams, and partner on state research.',
    icon: School,
    color: 'from-purple-500 to-indigo-600',
    borderActive: 'border-purple-500 ring-2 ring-purple-500/20 bg-purple-50/50',
    badge: 'Academic Lead'
  },
  {
    id: 'INDUSTRY',
    title: 'Industry / CSR',
    subtitle: 'Corporate Sponsor',
    description: 'Fund civic solutions via CSR grants, adopt student prototypes, and offer test sandboxes.',
    icon: Building2,
    color: 'from-amber-500 to-orange-600',
    borderActive: 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/50',
    badge: 'CSR Partner'
  },
  {
    id: 'GOVERNMENT',
    title: 'Nodal Officer',
    subtitle: 'Govt. Administrator',
    description: 'Triage citizen challenges, assign urgency tiers, verify evidence, and sign off.',
    icon: ShieldCheck,
    color: 'from-rose-500 to-red-600',
    borderActive: 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/50',
    badge: 'Govt. Official'
  }
];

export const RoleSelectionModal = () => {
  const { needsRoleSelection, updateUserRole, profile, user, setNeedsRoleSelection } = useAuth();

  const [selectedRole, setSelectedRole] = useState(profile?.role || 'CITIZEN');
  const [district, setDistrict] = useState(profile?.district || 'Ranchi');
  const [organization, setOrganization] = useState(profile?.organization || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [bio, setBio] = useState(profile?.bio || '');
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
      setNeedsRoleSelection(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentRoleObj = ROLES_INFO.find(r => r.id === selectedRole) || ROLES_INFO[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-hidden animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] animate-in zoom-in-95 duration-200">
        
        {/* 1. TOP HEADER BANNER (Fixed Header) */}
        <div className="shrink-0 bg-gradient-to-r from-brand-800 via-emerald-800 to-teal-800 text-white p-5 sm:p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-brand-300 text-xs font-bold uppercase tracking-wider font-mono mb-1">
              <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
              <span>Samadhan.Connect Onboarding</span>
            </div>
            
            {profile?.role && (
              <button
                onClick={() => setNeedsRoleSelection(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold font-display leading-tight">
            Select Your Role & Profile Details
          </h2>
          <p className="text-slate-200 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Welcome, <span className="font-bold text-white">{profile?.full_name || user?.email || 'Innovator'}</span>! Please define how you will engage with Jharkhand's civic innovation ecosystem.
          </p>
        </div>

        {/* 2. SCROLLABLE FORM BODY */}
        <form onSubmit={handleSubmit} id="role-selection-form" className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 custom-scrollbar text-left">
          
          {/* STEP 1: CHOOSE PERSONA */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                Step 1: Choose Your Persona <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400 font-medium">Click a card to select</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ROLES_INFO.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;

                return (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`relative p-3.5 rounded-2xl border-2 cursor-pointer transition-all duration-200 text-left flex flex-col justify-between ${
                      isSelected 
                        ? role.borderActive + ' shadow-md scale-[1.01]' 
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${role.color} text-white flex items-center justify-center shadow-xs`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        {isSelected ? (
                          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 font-mono">
                            {role.badge}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm leading-tight">{role.title}</h3>
                      <p className="text-[10px] font-medium text-slate-400 mt-0.5">{role.subtitle}</p>
                      
                      <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                        {role.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: KEY PROFILE DETAILS */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
              Step 2: Key Profile Details
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
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

        </form>

        {/* 3. STICKY BOTTOM ACTION FOOTER (Always Visible & Accessible) */}
        <div className="shrink-0 p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <span>Selected Persona:</span>
            <span className="font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
              {currentRoleObj?.title}
            </span>
          </div>

          <button
            type="submit"
            form="role-selection-form"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 via-emerald-600 to-teal-600 shadow-md shadow-brand-600/25 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Saving Profile...' : 'Complete Onboarding & Enter Platform'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
