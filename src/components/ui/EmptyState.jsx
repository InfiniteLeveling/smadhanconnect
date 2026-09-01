import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight, PlusCircle, Search, Compass } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Layers,
  title = 'No records found',
  description = 'There are currently no items to display in this view.',
  actionText,
  actionLink,
  onActionClick,
  actionIcon: ActionIcon = ArrowRight,
  secondaryActionText,
  secondaryActionLink,
  className = ''
}) => {
  return (
    <div className={`bg-white/85 backdrop-blur-md rounded-3xl border border-slate-200/90 p-8 sm:p-14 text-center space-y-5 shadow-sm max-w-xl mx-auto ${className}`}>
      {/* Icon Circle */}
      <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-50 to-emerald-100/70 border border-brand-200/80 text-brand-700 flex items-center justify-center mx-auto shadow-xs">
        <Icon className="w-8 h-8 animate-pulse" />
      </div>

      {/* Text Content */}
      <div className="space-y-1.5">
        <h3 className="text-xl font-bold font-display text-slate-900">
          {title}
        </h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {/* Action Buttons */}
      {(actionText || secondaryActionText) && (
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {actionText && actionLink && (
            <Link to={actionLink}>
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 via-emerald-600 to-teal-600 shadow-md shadow-brand-600/25 hover:shadow-lg hover:shadow-brand-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
                <span>{actionText}</span>
                <ActionIcon className="w-4 h-4" />
              </button>
            </Link>
          )}

          {actionText && onActionClick && (
            <button
              onClick={onActionClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 via-emerald-600 to-teal-600 shadow-md shadow-brand-600/25 hover:shadow-lg hover:shadow-brand-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>{actionText}</span>
              <ActionIcon className="w-4 h-4" />
            </button>
          )}

          {secondaryActionText && secondaryActionLink && (
            <Link to={secondaryActionLink}>
              <button className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer">
                {secondaryActionText}
              </button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};
