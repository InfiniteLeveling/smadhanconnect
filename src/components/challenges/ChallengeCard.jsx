import React from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../ui/StatusBadge';
import { MapPin, ThumbsUp, ArrowRight, Clock, Sparkles } from 'lucide-react';

export const ChallengeCard = ({ challenge, onUpvote }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 hover:border-brand-500/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      {/* Evidence Thumbnail if present */}
      {challenge.evidence_url && (
        <div className="h-44 w-full relative overflow-hidden bg-slate-100">
          <img 
            src={challenge.evidence_url} 
            alt={challenge.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <StatusBadge status={challenge.urgency} />
          </div>
          <div className="absolute top-3 right-3">
            <StatusBadge status={challenge.status} />
          </div>
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        {!challenge.evidence_url && (
          <div className="flex items-center justify-between gap-2">
            <StatusBadge status={challenge.urgency} />
            <StatusBadge status={challenge.status} />
          </div>
        )}

        <div className="space-y-2">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200/60 inline-block">
            {challenge.category_name || 'Civic Problem'}
          </span>
          <h3 className="text-lg font-bold font-display text-slate-900 leading-snug group-hover:text-brand-600 transition-colors line-clamp-2">
            {challenge.title}
          </h3>
          <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
            {challenge.description}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1 font-medium text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-brand-600" />
              <span>{challenge.district_name || 'Ranchi'} District</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{new Date(challenge.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={(e) => {
                e.preventDefault();
                onUpvote && onUpvote(challenge.id);
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-brand-600 bg-slate-50 hover:bg-brand-50 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{challenge.upvotes || 0} Upvotes</span>
            </button>

            <Link
              to={`/challenges/${challenge.id}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 group-hover:translate-x-0.5 transition-transform"
            >
              View & Bid <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
