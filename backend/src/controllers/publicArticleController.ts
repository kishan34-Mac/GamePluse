import { Request, Response } from 'express';
import { ArticleModel } from '../models/Article.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export async function getArticles(req: Request, res: Response) {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 9));
  const category = req.query.category as string | undefined;
  const tag = req.query.tag as string | undefined;
  const sort = (req.query.sort as string) || 'newest';

  const filter: Record<string, any> = { status: 'published' };

  if (category && category !== 'all') {
    filter.category = category.toLowerCase().trim();
  }

  if (tag) {
    filter.tags = { $in: [new RegExp(`^${tag.trim()}$`, 'i')] };
  }

  const sortOptions: Record<string, 1 | -1> =
    sort === 'oldest'
      ? { publishedAt: 1 }
      : sort === 'title'
      ? { title: 1 }
      : { publishedAt: -1 };

  const [total, articles] = await Promise.all([
    ArticleModel.countDocuments(filter),
    ArticleModel.find(filter)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
  ]);

  const totalPages = Math.ceil(total / limit) || 1;

  sendSuccess(res, articles, 200, {
    total,
    page,
    limit,
    totalPages,
    hasMore: page < totalPages,
  });
}

export async function getArticleBySlug(req: Request, res: Response) {
  const { slug } = req.params;
  const article = await ArticleModel.findOne({
    slug: slug.toLowerCase().trim(),
    status: 'published',
  }).lean();

  if (!article) {
    sendError(res, 'Article not found', 404, 'NOT_FOUND');
    return;
  }

  sendSuccess(res, article);
}

export async function getFeaturedArticles(_req: Request, res: Response) {
  const articles = await ArticleModel.find({
    status: 'published',
    featured: true,
  })
    .sort({ publishedAt: -1 })
    .limit(10)
    .lean();

  sendSuccess(res, articles);
}

export async function getTrendingArticles(_req: Request, res: Response) {
  const articles = await ArticleModel.find({
    status: 'published',
    trending: true,
  })
    .sort({ publishedAt: -1 })
    .limit(10)
    .lean();

  sendSuccess(res, articles);
}

export async function getPopularArticles(_req: Request, res: Response) {
  const articles = await ArticleModel.find({
    status: 'published',
    popular: true,
  })
    .sort({ publishedAt: -1 })
    .limit(10)
    .lean();

  sendSuccess(res, articles);
}

export async function getRelatedArticles(req: Request, res: Response) {
  const { id } = req.params;
  const limit = Math.min(10, Math.max(1, parseInt(req.query.limit as string) || 3));
  const category = req.query.category as string | undefined;
  const tags = (req.query.tags as string)?.split(',').filter(Boolean) || [];

  const filter: Record<string, any> = {
    status: 'published',
    _id: { $ne: id },
  };

  if (category) {
    filter.category = category.toLowerCase().trim();
  }

  let articles = await ArticleModel.find(filter)
    .sort({ publishedAt: -1 })
    .limit(limit * 2)
    .lean();

  // Score articles by shared tags
  if (tags.length > 0) {
    articles = articles
      .map(art => {
        const matches = (art.tags || []).filter(t => tags.includes(t)).length;
        return { ...art, score: matches };
      })
      .sort((a, b) => b.score - a.score);
  }

  sendSuccess(res, articles.slice(0, limit));
}
