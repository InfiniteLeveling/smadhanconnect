import React from 'react';
import { 
  Eye, 
  BarChart3, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  GraduationCap, 
  Building2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

const IMPACT_METRICS = [
  {
    title: 'Transparent Collaboration',
    description: 'Real-time tracking and updates',
    icon: Eye,
    stat: '100% Traceable',
    statSub: 'Public Audit Log'
  },
  {
    title: 'Data-Driven Decisions',
    description: 'Analytics for better outcomes',
    icon: BarChart3,
    stat: '24 Districts',
    statSub: 'Geospatial Heatmaps'
  },
  {
    title: 'Inclusive Innovation',
    description: 'Empowering every citizen',
    icon: Users,
    stat: '6 Personas',
    statSub: 'Tripartite Synergy'
  },
  {
    title: 'Stronger Jharkhand',
    description: 'Building a better tomorrow',
    icon: ShieldCheck,
    stat: '5-Phase Pipeline',
    statSub: 'Lab to Deployment'
  }
];

const ECOSYSTEM_FLOW = [
  { label: 'Citizens', desc: 'Ground Reports & Grievances', icon: Users, color: 'text-emerald-700 bg-emerald-50' },
  { label: 'Government', desc: 'Nodal Verification & Grading', icon: ShieldCheck, color: 'text-green-700 bg-green-50' },
  { label: 'Universities', desc: 'R&D & Student Innovations', icon: GraduationCap, color: 'text-teal-700 bg-teal-50' },
  { label: 'Industry', desc: 'CSR Capital & Commercialization', icon: Building2, color: 'text-emerald-800 bg-emerald-100/70' },
  { label: 'Solutions', desc: 'Measurable Civic Impact', icon: CheckCircle2, color: 'text-brand-800 bg-brand-100' },
];

export const ImpactSection = () => {
  return (
    <div className="w-full space-y-12">
      {/* 4 Impact Glass Cards */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {IMPACT_METRICS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative p-5 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1.5 hover:border-brand-400/80 hover:bg-white transition-all duration-300 ease-out flex flex-col justify-between"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200/60 flex items-center justify-center text-brand-700 group-hover:bg-brand-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-brand-500/20 group-hover:scale-105 transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold font-display text-sm text-slate-900 group-hover:text-brand-700 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      "{item.description}"
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="font-mono font-bold text-slate-800">
                    {item.stat}
                  </span>
                  <span className="text-slate-400 font-medium">
                    {item.statSub}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ecosystem Lifecycle Pathway Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-brand-950 via-slate-900 to-emerald-950 rounded-3xl text-white shadow-xl relative overflow-hidden">
        {/* Subtle Background Mesh Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-400 font-mono">
                Ecosystem Lifecycle
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold font-display text-white mt-1">
                The Jharkhand Civic Tech Synergy
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md">
              Bridging grassroots public feedback with state machinery, academic prototyping, and corporate CSR funding.
            </p>
          </div>

          {/* Stepper Flow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
            {ECOSYSTEM_FLOW.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div 
                  key={idx}
                  className="relative p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-brand-400/40 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400/80 font-bold">
                      0{idx + 1}
                    </span>
                  </div>
                  <h5 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                    {step.label}
                  </h5>
                  <p className="text-[11px] text-slate-300 mt-1 leading-tight">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
