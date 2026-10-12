import { Article } from '../types';
import { getGameById } from '../data/games';

export const getArticlePath = (article: Article): string => {
  if (article.category === 'reviews' && article.gameId) {
    const game = getGameById(article.gameId);
    if (game) return `/reviews/${game.slug}`;
  }

  return `/${article.category}/${article.slug}`;
};
