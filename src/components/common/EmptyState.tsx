import React from 'react';
import { Gamepad2, Search } from 'lucide-react';
import { Button } from './Button';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  icon?: 'search' | 'game' | 'default';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Content Found',
  description = 'We couldn’t find any articles or guides matching your criteria.',
  actionText = 'Reset Filters',
  actionHref,
  onAction,
  icon = 'game',
}) => {
  return (
    <div className="w-full py-16 px-4 flex flex-col items-center justify-center text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 my-6">
      <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 border border-purple-500/20">
        {icon === 'search' ? <Search className="w-8 h-8" /> : <Gamepad2 className="w-8 h-8" />}
      </div>
      <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      {actionHref ? (
        <Link to={actionHref}>
          <Button variant="primary" size="md">
            {actionText}
          </Button>
        </Link>
      ) : onAction ? (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionText}
        </Button>
      ) : null}
    </div>
  );
};
