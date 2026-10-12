import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, Sparkles } from 'lucide-react';
import { Article } from '../../types';
import { formatDate } from '../../utils/formatDate';
import { getAuthorById } from '../../data/authors';

export interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'horizontal' | 'compact';
  className?: string;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'default',
  className = '',
}) => {
  const author = getAuthorById(article.authorId);
  const categoryPath = `/${article.category}`;
  const articlePath = `/${article.category}/${article.slug}`;

  if (variant === 'horizontal') {
    return (
      <article
        className={`group relative flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5 ${className}`}
      >
        {/* Thumbnail */}
        <div className="relative sm:w-2/5 aspect-[16/10] sm:aspect-auto rounded-xl overflow-hidden shrink-0 bg-slate-900">
          <img
            src={article.image}
            alt={article.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <Link
            to={categoryPath}
            className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-slate-950/80 backdrop-blur-md text-purple-300 border border-purple-500/30 hover:bg-purple-600 hover:text-white transition-colors"
          >
            {article.category.replace('-', ' ')}
          </Link>
          {article.isSponsored && (
            <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-amber-500/90 text-black">
              Sponsored
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between flex-1 min-w-0">
          <div>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(article.publishedAt)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readingTime}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2 mb-2 leading-snug">
              <Link to={articlePath} className="focus:outline-none focus:underline">
                {article.title}
              </Link>
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
              {article.excerpt}
            </p>
          </div>

          {/* Author footer */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
            {author && (
              <>
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                  {author.name}
                </span>
              </>
            )}
          </div>
        </div>
      </article>
    );
  }

  // Default card
  return (
    <article
      className={`group relative flex flex-col rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5 overflow-hidden ${className}`}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
        <img
          src={article.image}
          alt={article.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        <Link
          to={categoryPath}
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-slate-950/80 backdrop-blur-md text-purple-300 border border-purple-500/30 hover:bg-purple-600 hover:text-white transition-colors"
        >
          {article.category.replace('-', ' ')}
        </Link>

        {article.trending && (
          <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-red-600/90 text-white">
            <Sparkles className="w-3 h-3" />
            Trending
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2.5">
          <span>{formatDate(article.publishedAt)}</span>
          <span>•</span>
          <span>{article.readingTime}</span>
        </div>

        <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2 mb-2 leading-snug">
          <Link to={articlePath} className="focus:outline-none focus:underline">
            {article.title}
          </Link>
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4 flex-1">
          {article.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          {author && (
            <div className="flex items-center gap-2">
              <img
                src={author.avatar}
                alt={author.name}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="text-slate-700 dark:text-slate-300 font-medium">{author.name}</span>
            </div>
          )}
          <span className="text-purple-600 dark:text-purple-400 font-semibold group-hover:translate-x-0.5 transition-transform">
            Read &rarr;
          </span>
        </div>
      </div>
    </article>
  );
};
