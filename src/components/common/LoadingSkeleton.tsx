import React from 'react';

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 overflow-hidden animate-pulse flex flex-col"
        >
          <div className="w-full aspect-video bg-slate-200 dark:bg-slate-800 rounded-xl mb-4" />
          <div className="flex items-center gap-2 mb-3">
            <div className="w-16 h-4 bg-slate-200 dark:bg-slate-800 rounded-full" />
            <div className="w-12 h-4 bg-slate-200 dark:bg-slate-800 rounded-full" />
          </div>
          <div className="w-full h-6 bg-slate-200 dark:bg-slate-800 rounded mb-2" />
          <div className="w-3/4 h-6 bg-slate-200 dark:bg-slate-800 rounded mb-4" />
          <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded mb-2" />
          <div className="w-2/3 h-3 bg-slate-200 dark:bg-slate-800 rounded mb-4" />
          <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="w-16 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        </div>
      ))}
    </>
  );
};

export const HeroSkeleton: React.FC = () => {
  return (
    <div className="w-full min-h-[460px] sm:min-h-[540px] rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-200 dark:bg-slate-900 animate-pulse p-6 sm:p-12 flex flex-col justify-end">
      <div className="max-w-3xl space-y-4">
        <div className="w-24 h-6 bg-slate-300 dark:bg-slate-800 rounded-full" />
        <div className="w-full sm:w-5/6 h-10 bg-slate-300 dark:bg-slate-800 rounded-xl" />
        <div className="w-3/4 h-10 bg-slate-300 dark:bg-slate-800 rounded-xl" />
        <div className="w-full sm:w-2/3 h-4 bg-slate-300 dark:bg-slate-800 rounded" />
        <div className="flex items-center gap-4 pt-4">
          <div className="w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-800" />
          <div className="w-32 h-4 bg-slate-300 dark:bg-slate-800 rounded" />
          <div className="w-24 h-4 bg-slate-300 dark:bg-slate-800 rounded" />
        </div>
      </div>
    </div>
  );
};

export const ArticleSkeleton: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 animate-pulse space-y-6">
      <div className="w-32 h-6 bg-slate-200 dark:bg-slate-800 rounded-full" />
      <div className="w-full h-12 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      <div className="w-3/4 h-12 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      <div className="flex items-center gap-4 py-4 border-y border-slate-200 dark:border-slate-800">
        <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-2">
          <div className="w-32 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="w-48 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>
      </div>
      <div className="w-full aspect-[16/9] rounded-2xl bg-slate-200 dark:bg-slate-800" />
      <div className="space-y-4 pt-4">
        <div className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="w-5/6 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>
    </div>
  );
};

export const PageSkeleton: React.FC = () => {
  return (
    <div className="space-y-12 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <HeroSkeleton />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CardSkeleton count={6} />
      </div>
    </div>
  );
};
