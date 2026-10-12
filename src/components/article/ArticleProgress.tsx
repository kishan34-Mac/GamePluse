import React, { useEffect, useState } from 'react';

export const ArticleProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const percentage = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
      setProgress(percentage);
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-1 z-50 bg-slate-200/20 dark:bg-slate-800/20 pointer-events-none"
    >
      <div
        className="h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-400 transition-all duration-75 ease-out shadow-sm shadow-purple-500/50"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
