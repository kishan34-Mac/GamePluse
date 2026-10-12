import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, RefreshCw, ShieldAlert } from 'lucide-react';
import { Article, Author } from '../../types';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { ArticleShare } from './ArticleShare';
import { formatDate } from '../../utils/formatDate';

interface ArticleHeaderProps {
  article: Article;
  author?: Author;
  className?: string;
}

export const ArticleHeader: React.FC<ArticleHeaderProps> = ({
  article,
  author,
  className = '',
}) => {
  const categoryLabel = article.category.replace('-', ' ');

  const breadcrumbs = [
    { label: categoryLabel.toUpperCase(), href: `/${article.category}` },
    { label: article.title },
  ];

  return (
    <header className={`space-y-6 ${className}`}>
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} />

      {/* Category & Sponsored Pill */}
      <div className="flex flex-wrap items-center gap-2">
        <Link
          to={`/${article.category}`}
          className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-600 text-white shadow-md shadow-purple-600/30 hover:bg-purple-500 transition-colors"
        >
          {categoryLabel}
        </Link>

        {article.isSponsored && (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-500 border border-amber-500/30 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            Sponsored Editorial
          </span>
        )}
      </div>

      {/* Primary H1 */}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display text-slate-900 dark:text-white tracking-tight leading-[1.1] sm:leading-[1.15]">
        {article.title}
      </h1>

      {/* Subtitle / Dek */}
      {article.subtitle && (
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-4xl">
          {article.subtitle}
        </p>
      )}

      {/* Author & Meta Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 border-y border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          {author && (
            <img
              src={author.avatar}
              alt={author.name}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-purple-500/40"
            />
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                {author ? author.name : 'GAMEPULSE Staff'}
              </span>
              {author && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  ({author.role})
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(article.publishedAt)}
              </span>
              {article.updatedAt && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                    <RefreshCw className="w-3 h-3" />
                    Updated {formatDate(article.updatedAt)}
                  </span>
                </>
              )}
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readingTime}
              </span>
            </div>
          </div>
        </div>

        {/* Share buttons */}
        <ArticleShare title={article.title} />
      </div>

      {/* Sponsored Disclosure Box */}
      {article.isSponsored && article.sponsorDisclosure && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
          <span className="font-bold uppercase tracking-wider block mb-1">Transparency Statement:</span>
          {article.sponsorDisclosure}
        </div>
      )}

      {/* Hero Image */}
      <figure className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-2xl">
        <img
          src={article.image}
          alt={article.title}
          className="w-full max-h-[580px] object-cover"
        />
        {article.imageCaption && (
          <figcaption className="p-3 sm:p-4 text-center text-xs text-slate-400 bg-slate-950/90 border-t border-slate-800/80">
            {article.imageCaption}
          </figcaption>
        )}
      </figure>
    </header>
  );
};
