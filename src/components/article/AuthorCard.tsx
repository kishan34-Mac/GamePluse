import React from 'react';
import { Author } from '../../types';
import { Mail } from 'lucide-react';
import { XIcon } from '../common/SocialIcons';

interface AuthorCardProps {
  author: Author;
  className?: string;
}

export const AuthorCard: React.FC<AuthorCardProps> = ({ author, className = '' }) => {
  return (
    <div
      className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left ${className}`}
    >
      <img
        src={author.avatar}
        alt={author.name}
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-purple-500/40 shrink-0 shadow-lg"
      />

      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div>
            <h4 className="text-lg font-bold font-display text-slate-900 dark:text-white">
              {author.name}
            </h4>
            <p className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              {author.role}
            </p>
          </div>

          {/* Social buttons */}
          <div className="flex items-center justify-center sm:justify-start gap-2">
            {author.socialLinks?.twitter && (
              <a
                href={author.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow ${author.name} on X`}
                className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <XIcon className="w-3.5 h-3.5" />
              </a>
            )}
            {author.socialLinks?.email && (
              <a
                href={`mailto:${author.socialLinks.email}`}
                aria-label={`Email ${author.name}`}
                className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {author.bio}
        </p>
      </div>
    </div>
  );
};
