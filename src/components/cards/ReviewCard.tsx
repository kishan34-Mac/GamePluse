import React from 'react';
import { Link } from 'react-router-dom';
import { Review, Game } from '../../types';
import { ReviewScore } from '../reviews/ReviewScore';
import { GAMES } from '../../data/games';
import { ArrowRight } from 'lucide-react';

export interface ReviewCardProps {
  review: Review;
  game?: Game;
  className?: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, game, className = '' }) => {
  const matchedGame = game || GAMES.find(g => g.id === review.gameId);
  const cover = review.coverImage || matchedGame?.cover || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&h=800&q=80';
  const reviewPath = `/reviews/${review.slug}`;

  return (
    <article
      className={`group relative flex flex-col rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5 overflow-hidden ${className}`}
    >
      {/* Cover / Hero image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
        <img
          src={cover}
          alt={review.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80" />

        {/* Floating editorial score badge */}
        <div className="absolute top-3 right-3">
          <ReviewScore score={review.score} size="sm" />
        </div>

        {/* Platforms */}
        {matchedGame && (
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1 max-w-[85%]">
            {matchedGame.platforms.slice(0, 3).map((plat, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-950/80 backdrop-blur-md text-slate-300 border border-white/10"
              >
                {plat}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        {matchedGame && (
          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1.5">
            {matchedGame.genre}
          </span>
        )}

        <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2 mb-2.5">
          <Link to={reviewPath} className="focus:outline-none focus:underline">
            {review.title}
          </Link>
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4 flex-1">
          {review.verdict}
        </p>

        {/* CTA */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Score:</span>
            <span className="text-purple-600 dark:text-purple-400 font-mono text-sm">
              {review.score.toFixed(1)}/10
            </span>
          </div>

          <Link
            to={reviewPath}
            className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform"
          >
            <span>Read Review</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};
