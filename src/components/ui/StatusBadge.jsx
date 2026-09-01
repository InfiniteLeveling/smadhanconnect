import React from 'react';
import { cn } from './Button';

export const StatusBadge = ({ status, variant, className }) => {
  const getBadgeStyle = (statusVal) => {
    switch (statusVal?.toUpperCase()) {
      // Urgency Levels
      case 'CRITICAL':
        return 'bg-red-500/10 text-red-700 border-red-200 ring-red-500/20';
      case 'HIGH':
        return 'bg-amber-500/10 text-amber-700 border-amber-200 ring-amber-500/20';
      case 'MEDIUM':
        return 'bg-blue-500/10 text-blue-700 border-blue-200 ring-blue-500/20';
      case 'LOW':
        return 'bg-slate-500/10 text-slate-700 border-slate-200 ring-slate-500/20';

      // Statuses
      case 'SUBMITTED':
        return 'bg-purple-500/10 text-purple-700 border-purple-200 ring-purple-500/20';
      case 'VERIFIED':
      case 'OPEN_FOR_SOLUTIONS':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-200 ring-emerald-500/20';
      case 'SOLUTION_PROPOSED':
        return 'bg-cyan-500/10 text-cyan-700 border-cyan-200 ring-cyan-500/20';
      case 'PROTOTYPE':
      case 'FIELD_TESTING':
        return 'bg-indigo-500/10 text-indigo-700 border-indigo-200 ring-indigo-500/20';
      case 'RESOLVED':
      case 'COMPLETED':
        return 'bg-brand-500/15 text-brand-800 border-brand-300 ring-brand-500/30 font-semibold';
      case 'REJECTED':
        return 'bg-rose-500/10 text-rose-700 border-rose-200 ring-rose-500/20';
      
      // Default
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-400/20';
    }
  };

  const formatText = (text) => {
    if (!text) return '';
    return text.replace(/_/g, ' ');
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ring-1 ring-inset uppercase tracking-wider',
        getBadgeStyle(status),
        className
      )}
    >
      {formatText(status)}
    </span>
  );
};
