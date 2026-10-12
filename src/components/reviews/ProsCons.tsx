import React from 'react';
import { Check, X } from 'lucide-react';

interface ProsConsProps {
  pros: string[];
  cons: string[];
  className?: string;
}

export const ProsCons: React.FC<ProsConsProps> = ({ pros, cons, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 my-6 ${className}`}>
      {/* The Good */}
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/20 p-5 sm:p-6">
        <h4 className="flex items-center gap-2 text-sm sm:text-base font-bold font-display uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-4">
          <span className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <Check className="w-4 h-4" />
          </span>
          <span>The Highlights</span>
        </h4>
        <ul className="space-y-3">
          {pros.map((pro, index) => (
            <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{pro}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* The Bad */}
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 dark:bg-rose-950/20 p-5 sm:p-6">
        <h4 className="flex items-center gap-2 text-sm sm:text-base font-bold font-display uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-4">
          <span className="w-6 h-6 rounded-lg bg-rose-500/20 flex items-center justify-center">
            <X className="w-4 h-4" />
          </span>
          <span>The Drawbacks</span>
        </h4>
        <ul className="space-y-3">
          {cons.map((con, index) => (
            <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{con}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
