import React from 'react';
import { Link } from 'react-router-dom';
import { Game } from '../../types';
import { ArrowRight, Star } from 'lucide-react';

export interface GameCardProps {
  game: Game;
  className?: string;
}

export const GameCard: React.FC<GameCardProps> = ({ game, className = '' }) => {
  const gamePath = `/games/${game.slug}`;

  return (
    <div
      className={`group relative flex flex-col rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5 overflow-hidden ${className}`}
    >
      {/* Cover */}
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-950">
        <img
          src={game.cover}
          alt={game.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-75" />

        {game.score && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-purple-500/40 text-purple-300 font-mono text-xs font-bold flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span>{game.score.toFixed(1)}</span>
          </div>
        )}

        <div className="absolute bottom-3 left-3 right-3">
          <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider block mb-1">
            {game.genre}
          </span>
          <h3 className="text-base font-bold font-display text-white line-clamp-1 leading-snug">
            {game.title}
          </h3>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 justify-between text-xs space-y-3">
        <div className="space-y-1 text-slate-500 dark:text-slate-400">
          <div className="flex justify-between">
            <span>Dev:</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-[140px]">
              {game.developer}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Release:</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">{game.releaseDate}</span>
          </div>
        </div>

        <Link
          to={gamePath}
          className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-purple-600 hover:text-white dark:bg-slate-800 dark:hover:bg-purple-600 text-slate-800 dark:text-slate-200 font-semibold text-center transition-all flex items-center justify-center gap-1.5"
        >
          <span>Explore Game Hub</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
