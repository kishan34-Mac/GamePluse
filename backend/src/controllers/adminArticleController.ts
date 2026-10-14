import { Request, Response } from 'express';
import sanitizeHtml from 'sanitize-html';
import { ArticleModel, IArticle } from '../models/Article.js';
import { slugify } from '../utils/slugify.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

function calculateReadingTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function sanitizeText(str?: string): string {
  if (!str) return '';
  return sanitizeHtml(str, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3', 'h4', 'span', 'figure', 'figcaption']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      '*': ['class', 'id'],
    },
  });
}

export async function getAdminArticles(req: Request, res: Response) {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 15));
  const status = req.query.status as string | undefined;
  const category = req.query.category as string | undefined;
  const search = (req.query.search as string || '').trim();

  const filter: Record<string, any> = {};

  if (status && status !== 'all') {
    filter.status = status;
  }

  if (category && category !== 'all') {
    filter.category = category.toLowerCase().trim();
  }

  // If author role, only list own articles unless requested otherwise
  if (req.admin && req.admin.role === 'author') {
    filter.authorId = req.admin.id;
  }

  if (search) {
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [
      { title: new RegExp(escaped, 'i') },
      { slug: new RegExp(escaped, 'i') },
    ];
  }

  const [total, articles] = await Promise.all([
    ArticleModel.countDocuments(filter),
    ArticleModel.find(filter)
      .sort({ updatedAt: -1 })
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

export async function getAdminArticleById(req: Request, res: Response) {
  const { id } = req.params;
  const article = await ArticleModel.findById(id).lean();

  if (!article) {
    sendError(res, 'Article not found', 404, 'NOT_FOUND');
    return;
  }

  // If author role, verify ownership
  if (req.admin && req.admin.role === 'author' && article.authorId !== req.admin.id) {
    sendError(res, 'Forbidden: You do not have access to this article', 403, 'FORBIDDEN');
    return;
  }

  sendSuccess(res, article);
}

export async function createArticle(req: Request, res: Response) {
  const admin = req.admin!;
  const body = req.body;

  // Enforce authorId: authors cannot set authorId to someone else
  const authorId = admin.role === 'author' ? admin.id : body.authorId || admin.id;

  // Authors cannot publish directly
  let status = body.status || 'draft';
  if (admin.role === 'author' && status === 'published') {
    status = 'draft';
  }

  // Slug generation and uniqueness check
  let finalSlug = slugify(body.slug || body.title);
  const existing = await ArticleModel.findOne({ slug: finalSlug });
  if (existing) {
    sendError(res, `An article with the slug "${finalSlug}" already exists. Please choose a unique slug.`, 409, 'DUPLICATE_SLUG');
    return;
  }

  // Reading time calculation
  let readingTime = body.readingTime;
  if (!readingTime) {
    const allText = [
      body.title,
      body.excerpt,
      body.rawContent || '',
      ...(body.contentBlocks || []).map((b: any) => b.text || ''),
    ].join(' ');
    readingTime = calculateReadingTime(allText);
  }

  const article = await ArticleModel.create({
    ...body,
    slug: finalSlug,
    authorId,
    status,
    readingTime,
    rawContent: sanitizeText(body.rawContent),
    publishedAt: status === 'published' ? body.publishedAt || new Date() : undefined,
  });

  sendSuccess(res, article, 201);
}

export async function updateArticle(req: Request, res: Response) {
  const { id } = req.params;
  const admin = req.admin!;
  const article = await ArticleModel.findById(id);

  if (!article) {
    sendError(res, 'Article not found', 404, 'NOT_FOUND');
    return;
  }

  // Authorization check for authors
  if (admin.role === 'author' && article.authorId !== admin.id) {
    sendError(res, 'Forbidden: You can only edit your own articles', 403, 'FORBIDDEN');
    return;
  }

  const body = req.body;

  // Authors cannot elevate status to published
  if (admin.role === 'author' && body.status === 'published' && article.status !== 'published') {
    sendError(res, 'Forbidden: Authors cannot publish articles directly. Please submit as draft for review.', 403, 'FORBIDDEN');
    return;
  }

  // Check slug uniqueness if slug changed
  if (body.slug && body.slug !== article.slug) {
    const slugExists = await ArticleModel.findOne({ slug: body.slug, _id: { $ne: id } });
    if (slugExists) {
      sendError(res, `The slug "${body.slug}" is already taken by another article.`, 409, 'DUPLICATE_SLUG');
      return;
    }
    article.slug = slugify(body.slug);
  }

  if (body.rawContent !== undefined) {
    article.rawContent = sanitizeText(body.rawContent);
  }

  // Update fields safely
  const allowedFields: (keyof IArticle)[] = [
    'title', 'subtitle', 'excerpt', 'category', 'image', 'imageCaption',
    'tags', 'featured', 'trending', 'popular', 'editorsPick', 'status',
    'isSponsored', 'sponsorName', 'sponsorDisclosure', 'seoTitle',
    'seoDescription', 'canonicalUrl', 'contentBlocks', 'tableOfContents',
    'faqs', 'gameId', 'readingTime',
  ];

  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      (article as any)[field] = body[field];
    }
  });

  if (admin.role !== 'author' && body.authorId) {
    article.authorId = body.authorId;
  }

  if (body.status === 'published' && !article.publishedAt) {
    article.publishedAt = new Date();
  }

  await article.save();
  sendSuccess(res, article);
}

export async function deleteArticle(req: Request, res: Response) {
  const { id } = req.params;
  const admin = req.admin!;
  const article = await ArticleModel.findById(id);

  if (!article) {
    sendError(res, 'Article not found', 404, 'NOT_FOUND');
    return;
  }

  // Authors cannot delete articles unless explicitly authorized
  if (admin.role === 'author') {
    sendError(res, 'Forbidden: Authors cannot delete articles', 403, 'FORBIDDEN');
    return;
  }

  await ArticleModel.findByIdAndDelete(id);
  sendSuccess(res, { message: 'Article permanently deleted' });
}

export async function publishArticle(req: Request, res: Response) {
  const { id } = req.params;
  const admin = req.admin!;

  if (admin.role === 'author') {
    sendError(res, 'Forbidden: Authors cannot publish content directly', 403, 'FORBIDDEN');
    return;
  }

  const article = await ArticleModel.findById(id);
  if (!article) {
    sendError(res, 'Article not found', 404, 'NOT_FOUND');
    return;
  }

  article.status = 'published';
  if (!article.publishedAt) {
    article.publishedAt = new Date();
  }
  await article.save();

  sendSuccess(res, article);
}

export async function archiveArticle(req: Request, res: Response) {
  const { id } = req.params;
  const admin = req.admin!;

  if (admin.role === 'author') {
    sendError(res, 'Forbidden: Authors cannot archive content', 403, 'FORBIDDEN');
    return;
  }

  const article = await ArticleModel.findById(id);
  if (!article) {
    sendError(res, 'Article not found', 404, 'NOT_FOUND');
    return;
  }

  article.status = 'archived';
  await article.save();

  sendSuccess(res, article);
}
