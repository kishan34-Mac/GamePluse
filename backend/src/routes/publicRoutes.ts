import { Router } from 'express';
import { getHealth } from '../controllers/healthController.js';
import { getSitemap } from '../controllers/sitemapController.js';
import {
  getArticles,
  getArticleBySlug,
  getFeaturedArticles,
  getTrendingArticles,
  getPopularArticles,
  getRelatedArticles,
} from '../controllers/publicArticleController.js';
import {
  getCategories,
  getCategoryBySlug,
  getTags,
  getGames,
  getGameBySlug,
  getGameById,
  getReviews,
  getReviewBySlug,
  getReviewByGameId,
  getAuthors,
  getAuthorById,
  searchContent,
} from '../controllers/publicContentController.js';
import { subscribe, unsubscribe } from '../controllers/newsletterController.js';
import { searchLimiter, newsletterLimiter } from '../middleware/rateLimit.js';
import { validate } from '../middleware/validate.js';
import { subscribeNewsletterSchema } from '../validators/newsletterValidators.js';

const router = Router();

// System Health & Sitemap
router.get('/health', getHealth);
router.get('/sitemap.xml', getSitemap);

// Articles
router.get('/articles', getArticles);
router.get('/articles/featured', getFeaturedArticles);
router.get('/articles/trending', getTrendingArticles);
router.get('/articles/popular', getPopularArticles);
router.get('/articles/related/:id', getRelatedArticles);
router.get('/articles/:slug', getArticleBySlug);

// Categories & Tags
router.get('/categories', getCategories);
router.get('/categories/:slug', getCategoryBySlug);
router.get('/tags', getTags);

// Games
router.get('/games', getGames);
router.get('/games/id/:id', getGameById);
router.get('/games/:slug', getGameBySlug);

// Reviews
router.get('/reviews', getReviews);
router.get('/reviews/game/:gameId', getReviewByGameId);
router.get('/reviews/:slug', getReviewBySlug);

// Authors
router.get('/authors', getAuthors);
router.get('/authors/:id', getAuthorById);

// Search
router.get('/search', searchLimiter, searchContent);

// Newsletter
router.post(
  '/newsletter/subscribe',
  newsletterLimiter,
  validate({ body: subscribeNewsletterSchema }),
  subscribe
);
router.get('/newsletter/unsubscribe', unsubscribe);

export default router;
