import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, ArrowRight, Flame } from 'lucide-react';
import { Article } from '../../types';
import { formatDate } from '../../utils/formatDate';
import { getAuthorById } from '../../data/authors';
import { getArticlePath } from '../../utils/contentPaths';

export interface FeaturedArticleProps {
  article: Article;
  isHero?: boolean;
  className?: string;
}

export const FeaturedArticle: React.FC<FeaturedArticleProps> = ({
  article,
  isHero = false,
  className = '',
}) => {
  const author = getAuthorById(article.authorId);
  const articlePath = getArticlePath(article);

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-950 shadow-2xl transition-all duration-300 ${
        isHero ? 'min-h-[440px] sm:min-h-[560px] lg:min-h-[620px]' : 'min-h-[380px] sm:min-h-[460px]'
      } flex flex-col justify-end ${className}`}
    >
      {/* Background Image with Zoom */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {/* Cinematic dark multi-layer gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 p-5 sm:p-8 lg:p-12 max-w-4xl flex flex-col justify-end">
        {/* Category & Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
          <Link
            to={`/${article.category}`}
            className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-purple-600 text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition-colors"
          >
            {article.category.replace('-', ' ')}
          </Link>

          {article.trending && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-600/90 backdrop-blur-md text-white">
              <Flame className="w-3.5 h-3.5" />
              Trending
            </span>
          )}

          <div className="flex items-center gap-2 text-xs text-slate-300 ml-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              {formatDate(article.publishedAt)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {article.readingTime}
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1
          className={`${
            isHero
              ? 'text-2xl sm:text-4xl lg:text-5xl font-black'
              : 'text-xl sm:text-3xl font-extrabold'
          } font-display text-white tracking-tight leading-tight sm:leading-snug mb-3 sm:mb-4 group-hover:text-purple-300 transition-colors`}
        >
          <Link to={articlePath} className="focus:outline-none focus:underline">
            {article.title}
          </Link>
        </h1>

        {/* Excerpt */}
        <p className="text-slate-300 text-sm sm:text-base lg:text-lg line-clamp-2 sm:line-clamp-3 max-w-2xl leading-relaxed mb-6">
          {article.excerpt}
        </p>

        {/* Author + CTA Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
          {author && (
            <div className="flex items-center gap-3">
              <img
                src={author.avatar}
                alt={author.name}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-purple-500/40"
              />
              <div>
                <p className="text-xs sm:text-sm font-bold text-white leading-none">{author.name}</p>
                <p className="text-[11px] text-slate-400 mt-1">{author.role}</p>
              </div>
            </div>
          )}

          <Link
            to={articlePath}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-white/10 hover:bg-purple-600 text-white font-semibold text-xs sm:text-sm backdrop-blur-md border border-white/20 hover:border-purple-500 transition-all group-hover:shadow-lg group-hover:shadow-purple-600/20"
          >
            <span>Read Full Story</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
};
