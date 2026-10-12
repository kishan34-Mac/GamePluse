import React from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { Link } from 'react-router-dom';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Signal Lost in Transmission',
  message = 'We encountered an unexpected disruption loading this gaming briefing. Please try recalibrating your connection.',
  onRetry,
}) => {
  return (
    <div className="w-full py-16 px-4 flex flex-col items-center justify-center text-center rounded-2xl border border-rose-500/20 bg-rose-500/5 dark:bg-rose-950/20 my-8">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4 border border-rose-500/20">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
        {message}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <Button
            variant="primary"
            size="md"
            onClick={onRetry}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Retry Connection
          </Button>
        )}
        <Link to="/">
          <Button variant="secondary" size="md" leftIcon={<Home className="w-4 h-4" />}>
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
};
