import React from 'react';

export interface AdSlotProps {
  variant: 'leaderboard' | 'inArticle' | 'sidebar' | 'inFeed';
  slotId?: string;
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ variant, slotId = 'default', className = '' }) => {
  const configs = {
    leaderboard: {
      container: 'w-full py-4 my-6 flex flex-col items-center justify-center',
      box: 'w-full max-w-[970px] h-[90px] sm:h-[100px] lg:h-[120px]',
      label: 'Leaderboard Advertisement Placeholder',
    },
    inArticle: {
      container: 'w-full my-8 flex flex-col items-center justify-center',
      box: 'w-full max-w-[728px] h-[120px] sm:h-[160px]',
      label: 'In-Article Sponsored Ad Placement',
    },
    sidebar: {
      container: 'w-full my-6 flex flex-col items-center justify-center',
      box: 'w-full max-w-[336px] min-h-[280px]',
      label: 'Sidebar Display Slot (300x250 / 300x600)',
    },
    inFeed: {
      container: 'w-full my-4 flex flex-col items-center justify-center',
      box: 'w-full min-h-[140px] rounded-xl',
      label: 'Native In-Feed Sponsored Placement',
    },
  };

  const current = configs[variant];

  return (
    <aside
      aria-label="Advertisement"
      className={`${current.container} ${className}`}
      data-ad-slot={slotId}
      data-ad-variant={variant}
    >
      <div className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-600 font-mono mb-1.5 select-none">
        Advertisement
      </div>
      <div
        className={`${current.box} rounded-lg border border-dashed border-slate-300 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/40 flex flex-col items-center justify-center p-4 text-center select-none transition-colors hover:border-slate-400 dark:hover:border-slate-700`}
      >
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
          {current.label}
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-600">
          Reserved for future AdSense / Direct Partner display
        </span>
      </div>
    </aside>
  );
};
