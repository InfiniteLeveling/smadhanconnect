import React from 'react';
import { Link } from 'react-router-dom';
import { Interactive3DCard } from '../ui/Interactive3DCard';
import { 
  FileEdit, 
  ShieldCheck, 
  Compass, 
  Layers, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  Lock,
  Cpu
} from 'lucide-react';

const WORKFLOW_CARDS = [
  {
    step: '01',
    title: '1. Citizen Wizard',
    subtitle: 'Submit civic challenges with draft auto-saving.',
    link: '/report-problem',
    icon: FileEdit,
    tag: 'Draft Auto-Saving',
    tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    iconGradient: 'from-emerald-500 to-teal-600',
    accentBorder: 'hover:border-emerald-500',
    glowColor: 'hover:shadow-emerald-500/10',
    highlightText: 'Instant AI categorization and offline local draft persistence.'
  },
  {
    step: '02',
    title: '2. Nodal Triage Queue',
    subtitle: 'Verify citizen reports and assign urgency grades.',
    link: '/dashboard/government',
    icon: ShieldCheck,
    tag: 'Nodal Verification',
    tagColor: 'bg-green-50 text-green-700 border-green-200/60',
    iconGradient: 'from-green-600 to-emerald-700',
    accentBorder: 'hover:border-green-500',
    glowColor: 'hover:shadow-green-500/10',
    highlightText: 'Official review portal with SLA tracking and priority grading.'
  },
  {
    step: '03',
    title: '3. Challenge Marketplace',
    subtitle: 'Discover 24 districts & propose solutions.',
    link: '/challenges',
    icon: Compass,
    tag: '24 Districts',
    tagColor: 'bg-teal-50 text-teal-700 border-teal-200/60',
    iconGradient: 'from-teal-500 to-brand-600',
    accentBorder: 'hover:border-teal-500',
    glowColor: 'hover:shadow-teal-500/10',
    highlightText: 'Collaborative open repository for students, researchers & startups.'
  },
  {
    step: '04',
    title: '4. 5-Phase Project Workspace',
    subtitle: 'Interactive Kanban & IoT telemetry feed.',
    link: '/projects/proj-001',
    icon: Layers,
    tag: 'Interactive Kanban',
    tagColor: 'bg-brand-50 text-brand-700 border-brand-200/60',
    iconGradient: 'from-brand-600 to-emerald-600',
    accentBorder: 'hover:border-brand-500',
    glowColor: 'hover:shadow-brand-500/10',
    highlightText: 'End-to-end milestone lifecycle with sensor data feeds & evidence upload.'
  }
];

export const FeatureCards = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/70 text-brand-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            Core Ecosystem Workflows
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
            Designed for Seamless Civic Problem-Solving
          </h2>
        </div>
        <p className="text-sm text-slate-500 max-w-md">
          A synchronized pathway connecting on-ground citizen reports to verified industrial implementations.
        </p>
      </div>

      {/* 4 Feature Cards Grid with Interactive 3D Card Hover */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {WORKFLOW_CARDS.map((card) => {
          const Icon = card.icon;

          return (
            <Interactive3DCard
              key={card.step}
              maxTilt={5}
              className="h-full rounded-3xl"
            >
              <Link
                to={card.link}
                className={`group relative flex flex-col justify-between h-full p-6 sm:p-7 bg-white/85 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-sm transition-all duration-300 ease-out hover:shadow-xl hover:bg-white ${card.accentBorder} ${card.glowColor} overflow-hidden`}
              >
                {/* Top Accent Line on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  {/* Header with Circular Icon and Step Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${card.iconGradient} p-3 flex items-center justify-center text-white shadow-md shadow-emerald-700/15 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-400 group-hover:text-brand-600 transition-colors">
                      {card.step}
                    </span>
                  </div>

                  {/* Card Title & Subtitle */}
                  <h3 className="text-lg font-bold font-display text-slate-900 group-hover:text-brand-700 transition-colors flex items-center gap-1.5">
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {card.subtitle}
                  </p>

                  {/* Supporting Micro-Detail */}
                  <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-100/90 leading-normal">
                    {card.highlightText}
                  </p>
                </div>

                {/* Bottom Interactive CTA Link */}
                <div className="mt-6 pt-2 flex items-center justify-between">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${card.tagColor}`}>
                    {card.tag}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 group-hover:text-brand-800 transition-colors">
                    Explore
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                  </span>
                </div>
              </Link>
            </Interactive3DCard>
          );
        })}
      </div>
    </div>
  );
};
