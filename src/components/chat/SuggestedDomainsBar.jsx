import React from 'react';
import { SUGGESTED_DOMAIN_PROMPTS } from '../../services/aiChatService';
import { Sparkles } from 'lucide-react';

export const SuggestedDomainsBar = ({ onSelectPrompt, disabled = false }) => {
  return (
    <div className="px-4 py-2.5 bg-slate-50/90 backdrop-blur-md border-t border-slate-200/70 flex items-center gap-2 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 shrink-0 font-mono">
        <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
        <span className="uppercase tracking-wider">Ask about:</span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {SUGGESTED_DOMAIN_PROMPTS.map((item, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelectPrompt(item.prompt)}
            className="group px-3 py-1 rounded-full text-xs font-semibold bg-white hover:bg-brand-50 text-slate-700 hover:text-brand-800 border border-slate-200/90 hover:border-brand-300 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:scale-95 transition-all whitespace-nowrap cursor-pointer disabled:opacity-50 flex items-center gap-1"
            title={`Click to draft: "${item.prompt}"`}
          >
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
