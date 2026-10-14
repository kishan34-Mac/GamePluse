import { Request, Response } from 'express';
import { CategoryModel } from '../models/Category.js';
import { TagModel } from '../models/Tag.js';
import { GameModel } from '../models/Game.js';
import { ReviewModel } from '../models/Review.js';
import { AuthorModel } from '../models/Author.js';
import { ArticleModel } from '../models/Article.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

// Categories
export async function getCategories(_req: Request, res: Response) {
  const categories = await CategoryModel.find({ status: 'active' }).sort({ name: 1 }).lean();
  sendSuccess(res, categories);
}

export async function getCategoryBySlug(req: Request, res: Response) {
  const { slug } = req.params;
  const category = await CategoryModel.findOne({
    slug: slug.toLowerCase().trim(),
    status: 'active',
  }).lean();

  if (!category) {
    sendError(res, 'Category not found', 404, 'NOT_FOUND');
    return;
  }
  sendSuccess(res, category);
}

// Tags
export async function getTags(_req: Request, res: Response) {
  const tags = await TagModel.find().sort({ name: 1 }).lean();
  sendSuccess(res, tags);
}

// Games
export async function getGames(_req: Request, res: Response) {
  const games = await GameModel.find().sort({ title: 1 }).lean();
  sendSuccess(res, games);
}

export async function getGameBySlug(req: Request, res: Response) {
  const { slug } = req.params;
  const game = await GameModel.findOne({ slug: slug.toLowerCase().trim() }).lean();

  if (!game) {
    sendError(res, 'Game not found', 404, 'NOT_FOUND');
    return;
  }
  sendSuccess(res, game);
}

export async function getGameById(req: Request, res: Response) {
  const { id } = req.params;
  let game = await GameModel.findOne({
    $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { slug: id }],
  }).lean();

  if (!game) {
    sendError(res, 'Game not found', 404, 'NOT_FOUND');
    return;
  }
  sendSuccess(res, game);
}

// Reviews
export async function getReviews(_req: Request, res: Response) {
  const reviews = await ReviewModel.find({ status: 'published' })
    .sort({ publishedAt: -1 })
    .lean();
  sendSuccess(res, reviews);
}

export async function getReviewBySlug(req: Request, res: Response) {
  const { slug } = req.params;
  const review = await ReviewModel.findOne({
    slug: slug.toLowerCase().trim(),
    status: 'published',
  }).lean();

  if (!review) {
    sendError(res, 'Review not found', 404, 'NOT_FOUND');
    return;
  }
  sendSuccess(res, review);
}

export async function getReviewByGameId(req: Request, res: Response) {
  const { gameId } = req.params;
  const review = await ReviewModel.findOne({
    gameId,
    status: 'published',
  }).lean();

  if (!review) {
    sendError(res, 'Review not found for this game', 404, 'NOT_FOUND');
    return;
  }
  sendSuccess(res, review);
}

// Authors
export async function getAuthors(_req: Request, res: Response) {
  const authors = await AuthorModel.find({ isActive: true })
    .select('-__v')
    .sort({ name: 1 })
    .lean();
  sendSuccess(res, authors);
}

export async function getAuthorById(req: Request, res: Response) {
  const { id } = req.params;
  const author = await AuthorModel.findOne({
    $or: [
      { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
      { slug: id.toLowerCase().trim() },
    ],
    isActive: true,
  })
    .select('-__v')
    .lean();

  if (!author) {
    sendError(res, 'Author not found', 404, 'NOT_FOUND');
    return;
  }
  sendSuccess(res, author);
}

// Public Search
export async function searchContent(req: Request, res: Response) {
  const query = (req.query.q as string || '').trim();
  const category = req.query.category as string | undefined;
  const tag = req.query.tag as string | undefined;
  const limit = Math.min(20, Math.max(1, parseInt(req.query.limit as string) || 10));

  if (!query || query.length < 2) {
    sendSuccess(res, []);
    return;
  }

  // Safe escape for regex special characters
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const searchRegex = new RegExp(escaped, 'i');

  const filter: Record<string, any> = {
    status: 'published',
    $or: [
      { title: searchRegex },
      { subtitle: searchRegex },
      { excerpt: searchRegex },
      { tags: { $in: [searchRegex] } },
    ],
  };

  if (category && category !== 'all') {
    filter.category = category.toLowerCase().trim();
  }

  if (tag) {
    filter.tags = { $in: [new RegExp(`^${tag.trim()}$`, 'i')] };
  }

  const articles = await ArticleModel.find(filter)
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();

  sendSuccess(res, articles);
}
