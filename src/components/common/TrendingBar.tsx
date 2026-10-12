import React from 'react';
import { Link } from 'react-router-dom';
import { Flame } from 'lucide-react';
import { BRAND } from '../../config/brand';

export const TrendingBar: React.FC = () => {
  return (
    <div className="w-full border-y border-slate-200 dark:border-slate-800/80 bg-slate-100/70 dark:bg-slate-900/40 backdrop-blur-sm overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center">
        {/* Static Trending Label */}
        <div className="flex items-center gap-1.5 shrink-0 pr-3 sm:pr-4 border-r border-slate-300 dark:border-slate-800 text-xs font-bold tracking-wider uppercase text-purple-600 dark:text-purple-400">
          <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
          <span>Trending</span>
        </div>

        {/* Scrollable Topics on mobile, sleek wrap on desktop */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pl-3 sm:pl-4 py-0.5 text-xs">
          {BRAND.trendingTopics.map((topic, idx) => (
            <Link
              key={idx}
              to={`/search?q=${encodeURIComponent(topic.query)}`}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-slate-850 border border-slate-200/80 dark:border-slate-700/60 transition-all font-medium flex items-center gap-1"
            >
              <span className="text-slate-400 dark:text-slate-500 font-mono text-[10px]">#</span>
              {topic.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
