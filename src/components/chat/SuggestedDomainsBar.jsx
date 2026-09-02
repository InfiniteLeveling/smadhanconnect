import React from 'react';
import { SUGGESTED_DOMAIN_PROMPTS } from '../../services/aiChatService';
import { Sparkles } from 'lucide-react';

export const SuggestedDomainsBar = ({ onSelectPrompt, disabled = false }) => {
  return (
    <div className="px-4 py-2 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 shrink-0 font-mono">
        <Sparkles className="w-3 h-3 text-brand-600" />
        <span>Ask about:</span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {SUGGESTED_DOMAIN_PROMPTS.map((item, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelectPrompt(item.prompt)}
            className="px-2.5 py-1 rounded-full text-xs font-medium bg-white hover:bg-brand-50 text-slate-700 hover:text-brand-800 border border-slate-200/80 hover:border-brand-300 shadow-2xs hover:shadow-xs transition-all whitespace-nowrap cursor-pointer disabled:opacity-50"
            title={`Click to draft: "${item.prompt}"`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
