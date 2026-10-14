import { Router } from 'express';
import {
  login,
  logout,
  getMe,
  bootstrap,
} from '../controllers/adminAuthController.js';
import {
  getAdminArticles,
  getAdminArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  publishArticle,
  archiveArticle,
} from '../controllers/adminArticleController.js';
import {
  getDashboardStats,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAdminTags,
  createTag,
  deleteTag,
  getAdminGames,
  createGame,
  updateGame,
  deleteGame,
  getAdminReviews,
  createReview,
  updateReview,
  deleteReview,
  getAdminAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from '../controllers/adminCrudController.js';
import { uploadMedia, uploadMiddleware } from '../controllers/mediaController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimit.js';
import { validate } from '../middleware/validate.js';
import {
  loginSchema,
  bootstrapSchema,
  createAdminSchema,
  updateAdminSchema,
} from '../validators/authValidators.js';
import {
  createArticleSchema,
  updateArticleSchema,
} from '../validators/articleValidators.js';
import {
  createCategorySchema,
  updateCategorySchema,
  createTagSchema,
  createAuthorSchema,
  updateAuthorSchema,
} from '../validators/categoryValidators.js';
import {
  createGameSchema,
  updateGameSchema,
} from '../validators/gameValidators.js';
import {
  createReviewSchema,
  updateReviewSchema,
} from '../validators/reviewValidators.js';

const router = Router();

// Authentication
router.post('/auth/login', loginLimiter, validate({ body: loginSchema }), login);
router.post('/auth/logout', logout);
router.get('/auth/me', authenticate, getMe);
router.post('/auth/bootstrap', validate({ body: bootstrapSchema }), bootstrap);

// Dashboard Overview
router.get('/dashboard', authenticate, getDashboardStats);

// Articles
router.get('/articles', authenticate, getAdminArticles);
router.post(
  '/articles',
  authenticate,
  validate({ body: createArticleSchema }),
  createArticle
);
router.get('/articles/:id', authenticate, getAdminArticleById);
router.patch(
  '/articles/:id',
  authenticate,
  validate({ body: updateArticleSchema }),
  updateArticle
);
router.delete(
  '/articles/:id',
  authenticate,
  requireRole('super_admin', 'editor'),
  deleteArticle
);
router.post(
  '/articles/:id/publish',
  authenticate,
  requireRole('super_admin', 'editor'),
  publishArticle
);
router.post(
  '/articles/:id/archive',
  authenticate,
  requireRole('super_admin', 'editor'),
  archiveArticle
);

// Categories
router.get('/categories', authenticate, getAdminCategories);
router.post(
  '/categories',
  authenticate,
  requireRole('super_admin', 'editor'),
  validate({ body: createCategorySchema }),
  createCategory
);
router.patch(
  '/categories/:id',
  authenticate,
  requireRole('super_admin', 'editor'),
  validate({ body: updateCategorySchema }),
  updateCategory
);
router.delete(
  '/categories/:id',
  authenticate,
  requireRole('super_admin'),
  deleteCategory
);

// Tags
router.get('/tags', authenticate, getAdminTags);
router.post(
  '/tags',
  authenticate,
  requireRole('super_admin', 'editor'),
  validate({ body: createTagSchema }),
  createTag
);
router.delete(
  '/tags/:id',
  authenticate,
  requireRole('super_admin', 'editor'),
  deleteTag
);

// Games
router.get('/games', authenticate, getAdminGames);
router.post(
  '/games',
  authenticate,
  requireRole('super_admin', 'editor'),
  validate({ body: createGameSchema }),
  createGame
);
router.patch(
  '/games/:id',
  authenticate,
  requireRole('super_admin', 'editor'),
  validate({ body: updateGameSchema }),
  updateGame
);
router.delete(
  '/games/:id',
  authenticate,
  requireRole('super_admin'),
  deleteGame
);

// Reviews
router.get('/reviews', authenticate, getAdminReviews);
router.post(
  '/reviews',
  authenticate,
  requireRole('super_admin', 'editor'),
  validate({ body: createReviewSchema }),
  createReview
);
router.patch(
  '/reviews/:id',
  authenticate,
  requireRole('super_admin', 'editor'),
  validate({ body: updateReviewSchema }),
  updateReview
);
router.delete(
  '/reviews/:id',
  authenticate,
  requireRole('super_admin'),
  deleteReview
);

// Authors
router.get('/authors', authenticate, getAdminAuthors);
router.post(
  '/authors',
  authenticate,
  requireRole('super_admin', 'editor'),
  validate({ body: createAuthorSchema }),
  createAuthor
);
router.patch(
  '/authors/:id',
  authenticate,
  requireRole('super_admin', 'editor'),
  validate({ body: updateAuthorSchema }),
  updateAuthor
);
router.delete(
  '/authors/:id',
  authenticate,
  requireRole('super_admin'),
  deleteAuthor
);

// Admin Users (super_admin only)
router.get('/users', authenticate, requireRole('super_admin'), getAdminUsers);
router.post(
  '/users',
  authenticate,
  requireRole('super_admin'),
  validate({ body: createAdminSchema }),
  createAdminUser
);
router.patch(
  '/users/:id',
  authenticate,
  requireRole('super_admin'),
  validate({ body: updateAdminSchema }),
  updateAdminUser
);
router.delete(
  '/users/:id',
  authenticate,
  requireRole('super_admin'),
  deleteAdminUser
);

// Media Upload
router.post(
  '/media/upload',
  authenticate,
  uploadMiddleware.single('file'),
  uploadMedia
);

export default router;
