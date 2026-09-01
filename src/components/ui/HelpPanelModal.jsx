import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  PlusCircle, 
  Rocket, 
  TrendingUp, 
  MessageSquare, 
  GraduationCap, 
  Building2, 
  HelpCircle, 
  X, 
  ArrowRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

const HELP_TOPICS = [
  {
    title: 'Explore Challenges',
    link: '/challenges',
    icon: Compass,
    action: 'Find verified civic problems that need solutions.',
    tag: 'Discover',
    color: 'text-emerald-700 bg-emerald-50'
  },
  {
    title: 'Report a Problem',
    link: '/report-problem',
    icon: PlusCircle,
    action: 'Submit an on-ground civic issue in your community.',
    tag: 'Report',
    color: 'text-brand-700 bg-brand-50'
  },
  {
    title: '5-Phase Workspace',
    link: '/projects/proj-001',
    icon: Rocket,
    action: 'Track active projects through Kanban & IoT telemetry.',
    tag: 'Execute',
    color: 'text-teal-700 bg-teal-50'
  },
  {
    title: 'Analytics & Insights',
    link: '/analytics',
    icon: TrendingUp,
    action: 'Understand district trends, problem density & impact.',
    tag: 'Metrics',
    color: 'text-blue-700 bg-blue-50'
  },
  {
    title: 'Messaging & Chat',
    link: '/messages',
    icon: MessageSquare,
    action: 'Communicate in real-time with team collaborators.',
    tag: 'Collaborate',
    color: 'text-indigo-700 bg-indigo-50'
  },
  {
    title: 'Universities & CSR',
    link: '/universities',
    icon: GraduationCap,
    action: 'Academic research labs and corporate CSR grants.',
    tag: 'Partnerships',
    color: 'text-purple-700 bg-purple-50'
  }
];

export const HelpPanelModal = ({ isOpen, onClose, onOpenTour }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-2xl shadow-emerald-950/20 p-6 sm:p-8 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Top Accent Gradient */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-600 via-emerald-500 to-teal-500" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200/80 flex items-center justify-center text-brand-700 shadow-xs">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-slate-900">
                What can I do on Samadhan.Connect?
              </h3>
              <p className="text-xs text-slate-500">Quick Navigation & Capabilities Guide</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Close Help"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Topics List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-5 max-h-[60vh] overflow-y-auto no-scrollbar">
          {HELP_TOPICS.map((topic) => {
            const Icon = topic.icon;
            return (
              <Link
                key={topic.title}
                to={topic.link}
                onClick={onClose}
                className="group p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-brand-400 hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${topic.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {topic.tag}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                    {topic.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                    {topic.action}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100/80 flex items-center justify-end text-[11px] font-bold text-brand-700 group-hover:text-brand-800">
                  <span>Open Page &rarr;</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <button
            onClick={() => {
              onClose();
              onOpenTour();
            }}
            className="inline-flex items-center gap-1.5 text-brand-700 hover:text-brand-800 font-bold hover:underline cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>Restart Interactive Onboarding Tour</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Got it, thanks!
          </button>
        </div>

      </div>
    </div>
  );
};
