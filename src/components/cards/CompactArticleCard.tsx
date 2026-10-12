import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../../types';
import { formatDate } from '../../utils/formatDate';
import { getArticlePath } from '../../utils/contentPaths';

export interface CompactArticleCardProps {
  article: Article;
  indexNumber?: number;
  className?: string;
}

export const CompactArticleCard: React.FC<CompactArticleCardProps> = ({
  article,
  indexNumber,
  className = '',
}) => {
  const articlePath = getArticlePath(article);

  return (
    <article
      className={`group flex items-start gap-3 py-3 border-b border-slate-100 dark:border-slate-800/80 last:border-b-0 ${className}`}
    >
      {indexNumber !== undefined ? (
        <span className="font-display font-black text-2xl sm:text-3xl text-slate-300 dark:text-slate-800 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors w-7 shrink-0 text-center select-none">
          {String(indexNumber).padStart(2, '0')}
        </span>
      ) : (
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-slate-900 relative">
          <img
            src={article.image}
            alt={article.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mb-1">
          <span className="uppercase font-semibold tracking-wider text-purple-600 dark:text-purple-400">
            {article.category.replace('-', ' ')}
          </span>
          <span>•</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>

        <h4 className="text-sm font-semibold font-display text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2 leading-snug">
          <Link to={articlePath} className="focus:outline-none focus:underline">
            {article.title}
          </Link>
        </h4>
      </div>
    </article>
  );
};
