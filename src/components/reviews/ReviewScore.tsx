import React from 'react';

interface ReviewScoreProps {
  score: number; // 0 - 10
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const ReviewScore: React.FC<ReviewScoreProps> = ({
  score,
  size = 'md',
  showLabel = true,
  className = '',
}) => {
  // Score verdict evaluation
  const getVerdictLabel = (val: number) => {
    if (val >= 9.5) return 'Masterpiece';
    if (val >= 9.0) return 'Exceptional';
    if (val >= 8.0) return 'Great';
    if (val >= 7.0) return 'Good';
    if (val >= 5.0) return 'Mediocre';
    return 'Flawed';
  };

  const getScoreTheme = (val: number) => {
    if (val >= 9.0) {
      return {
        bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40',
        glow: 'shadow-emerald-500/20',
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      };
    }
    if (val >= 8.0) {
      return {
        bg: 'bg-purple-500/10 text-purple-400 border-purple-500/40',
        glow: 'shadow-purple-500/20',
        badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      };
    }
    return {
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/40',
      glow: 'shadow-amber-500/20',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    };
  };

  const theme = getScoreTheme(score);
  const verdictText = getVerdictLabel(score);

  if (size === 'sm') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border font-mono font-bold text-xs ${theme.bg} ${className}`}
      >
        <span>{score.toFixed(1)}</span>
      </div>
    );
  }

  if (size === 'lg') {
    return (
      <div
        className={`flex flex-col items-center justify-center p-6 rounded-2xl border ${theme.bg} ${theme.glow} shadow-xl backdrop-blur-md ${className}`}
      >
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">
          GAMEPULSE VERDICT
        </span>
        <div className="font-display font-black text-5xl sm:text-6xl tracking-tight leading-none mb-1">
          {score.toFixed(1)}
        </div>
        <div className="text-xs text-slate-400 font-mono mb-2">OUT OF 10</div>
        {showLabel && (
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${theme.badge}`}
          >
            {verdictText}
          </span>
        )}
      </div>
    );
  }

  // Medium default
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className={`w-11 h-11 rounded-xl border flex items-center justify-center font-display font-black text-lg ${theme.bg} ${theme.glow} shadow-md`}
      >
        {score.toFixed(1)}
      </div>
      {showLabel && (
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-900 dark:text-white leading-none">
            {verdictText}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Editorial Score</span>
        </div>
      )}
    </div>
  );
};
