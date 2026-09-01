import React from 'react';
import { Check, ChevronRight, Sparkles } from 'lucide-react';

const PHASES = [
  { id: 'RESEARCH', label: '1. Research & Baseline', desc: 'Feasibility & Assays' },
  { id: 'PROTOTYPE', label: '2. Prototype Lab', desc: 'Benchtop Fabrication' },
  { id: 'TESTING', label: '3. Field Testing', desc: 'Ground Trials & IoT' },
  { id: 'IMPLEMENTATION', label: '4. Implementation', desc: 'District Rollout' },
  { id: 'COMPLETED', label: '5. Completed', desc: 'Civic Handover' }
];

export const FivePhaseTracker = ({ currentPhase, onAdvancePhase, canAdvance }) => {
  const currentIndex = PHASES.findIndex(p => p.id === currentPhase);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
            Innovation Lifecycle Roadmap
          </span>
          <h2 className="text-xl font-bold font-display text-slate-900 mt-0.5">
            5-Phase Engineering Tracker
          </h2>
        </div>

        {canAdvance && currentIndex < PHASES.length - 1 && (
          <button
            onClick={() => onAdvancePhase(PHASES[currentIndex + 1].id)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-brand-600 text-white text-xs font-bold transition-all shadow-sm group"
          >
            <span>Advance to {PHASES[currentIndex + 1].label.split('.')[1]}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* Stepper Display */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {PHASES.map((phase, idx) => {
          const isPassed = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isUpcoming = idx > currentIndex;

          return (
            <div
              key={phase.id}
              className={`p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                isCurrent
                  ? 'bg-brand-50/80 border-brand-500 ring-2 ring-brand-500/20 shadow-sm'
                  : isPassed
                  ? 'bg-slate-50/80 border-slate-200 text-slate-700'
                  : 'bg-white border-slate-200/60 opacity-60 text-slate-400'
              }`}
            >
              {isCurrent && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-500 animate-ping"></div>
              )}

              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isPassed
                      ? 'bg-brand-600 text-white'
                      : isCurrent
                      ? 'bg-brand-500 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isPassed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                </div>
                <span className={`text-xs font-bold ${isCurrent ? 'text-brand-900' : 'text-slate-700'}`}>
                  {phase.id}
                </span>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-900 truncate">{phase.label.split('.')[1]}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{phase.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
