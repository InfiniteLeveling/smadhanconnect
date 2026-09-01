import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { isConfiguredSupabase } from '../../services/supabase';

const ROLES = [
  { id: 'CITIZEN', label: 'Citizen' },
  { id: 'STUDENT', label: 'Student' },
  { id: 'UNIVERSITY', label: 'University' },
  { id: 'INDUSTRY', label: 'Industry' },
  { id: 'GOVERNMENT', label: 'Nodal Officer' },
  { id: 'ADMIN', label: 'Admin' }
];

export const RoleSwitcherBar = () => {
  const { profile, simulateRole } = useAuth();
  const isRealBackend = isConfiguredSupabase();

  if (isRealBackend) return null; // Hide the simulator if connected to production

  return (
    <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 flex items-center justify-between z-50 sticky top-0">
      <div className="flex items-center gap-4">
        <span className="font-bold text-white tracking-widest uppercase">SIH Demo Mode</span>
        <span className="hidden sm:inline opacity-60">|</span>
        <span className="hidden sm:inline">Simulating Role:</span>
      </div>
      
      <div className="flex gap-1 overflow-x-auto no-scrollbar">
        {ROLES.map(role => (
          <button
            key={role.id}
            onClick={() => simulateRole(role.id)}
            className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
              profile?.role === role.id 
                ? 'bg-brand-500 text-white font-medium' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            {role.label}
          </button>
        ))}
      </div>
    </div>
  );
};
