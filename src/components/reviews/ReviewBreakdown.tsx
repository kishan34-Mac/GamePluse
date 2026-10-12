import React from 'react';
import { Review } from '../../types';

interface ReviewBreakdownProps {
  review: Review;
  className?: string;
}

export const ReviewBreakdown: React.FC<ReviewBreakdownProps> = ({ review, className = '' }) => {
  const categories = [
    { name: 'Gameplay Mechanics', data: review.gameplay },
    { name: 'Graphics & Art Direction', data: review.graphics },
    { name: 'Technical Performance', data: review.performance },
    { name: 'Sound Design & Score', data: review.audio },
    { name: 'Replayability & Value', data: review.replayability },
  ];

  return (
    <div
      className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 sm:p-8 ${className}`}
    >
      <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-6 flex items-center justify-between">
        <span>Scoring Breakdown</span>
        <span className="text-xs font-mono text-slate-500 font-normal">Scale: 1.0 — 10.0</span>
      </h3>

      <div className="space-y-6">
        {categories.map((cat, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-800 dark:text-slate-200">{cat.name}</span>
              <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                {cat.data.score.toFixed(1)}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 transition-all duration-1000"
                style={{ width: `${(cat.data.score / 10) * 100}%` }}
              />
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-0.5">
              {cat.data.details}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
