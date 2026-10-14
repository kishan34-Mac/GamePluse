import { Request, Response } from 'express';
import { ArticleModel } from '../models/Article.js';
import { CategoryModel } from '../models/Category.js';
import { TagModel } from '../models/Tag.js';
import { GameModel } from '../models/Game.js';
import { ReviewModel } from '../models/Review.js';
import { AuthorModel } from '../models/Author.js';
import { AdminModel } from '../models/Admin.js';
import { NewsletterSubscriberModel } from '../models/NewsletterSubscriber.js';
import { AuthService } from '../services/authService.js';
import { slugify } from '../utils/slugify.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

// ----------------- DASHBOARD OVERVIEW -----------------
export async function getDashboardStats(_req: Request, res: Response) {
  const [
    totalArticles,
    publishedArticles,
    draftArticles,
    archivedArticles,
    totalCategories,
    totalGames,
    totalReviews,
    totalAuthors,
    totalSubscribers,
    recentArticles,
  ] = await Promise.all([
    ArticleModel.countDocuments(),
    ArticleModel.countDocuments({ status: 'published' }),
    ArticleModel.countDocuments({ status: 'draft' }),
    ArticleModel.countDocuments({ status: 'archived' }),
    CategoryModel.countDocuments(),
    GameModel.countDocuments(),
    ReviewModel.countDocuments(),
    AuthorModel.countDocuments(),
    NewsletterSubscriberModel.countDocuments({ status: 'subscribed' }),
    ArticleModel.find().sort({ updatedAt: -1 }).limit(5).lean(),
  ]);

  sendSuccess(res, {
    articles: {
      total: totalArticles,
      published: publishedArticles,
      drafts: draftArticles,
      archived: archivedArticles,
    },
    categories: totalCategories,
    games: totalGames,
    reviews: totalReviews,
    authors: totalAuthors,
    subscribers: totalSubscribers,
    recentArticles,
  });
}

// ----------------- CATEGORIES -----------------
export async function getAdminCategories(_req: Request, res: Response) {
  const categories = await CategoryModel.find().sort({ name: 1 }).lean();
  sendSuccess(res, categories);
}

export async function createCategory(req: Request, res: Response) {
  const { name, slug, description, icon, heroImage, seoTitle, seoDescription, status } = req.body;
  const finalSlug = slugify(slug || name);

  const existing = await CategoryModel.findOne({ slug: finalSlug });
  if (existing) {
    sendError(res, 'Category slug already exists', 409, 'DUPLICATE_SLUG');
    return;
  }

  const category = await CategoryModel.create({
    name,
    slug: finalSlug,
    description,
    icon,
    heroImage,
    seoTitle,
    seoDescription,
    status: status || 'active',
  });

  sendSuccess(res, category, 201);
}

export async function updateCategory(req: Request, res: Response) {
  const { id } = req.params;
  const body = req.body;

  if (body.slug) {
    body.slug = slugify(body.slug);
    const existing = await CategoryModel.findOne({ slug: body.slug, _id: { $ne: id } });
    if (existing) {
      sendError(res, 'Category slug already taken', 409, 'DUPLICATE_SLUG');
      return;
    }
  }

  const category = await CategoryModel.findByIdAndUpdate(id, body, { new: true });
  if (!category) {
    sendError(res, 'Category not found', 404, 'NOT_FOUND');
    return;
  }

  sendSuccess(res, category);
}

export async function deleteCategory(req: Request, res: Response) {
  const { id } = req.params;
  const category = await CategoryModel.findById(id);

  if (!category) {
    sendError(res, 'Category not found', 404, 'NOT_FOUND');
    return;
  }

  // Prevent accidental deletion if articles still reference this category
  const refCount = await ArticleModel.countDocuments({ category: category.slug });
  if (refCount > 0) {
    sendError(res, `Cannot delete category: ${refCount} articles still belong to it. Reassign or delete articles first.`, 409, 'CATEGORY_IN_USE');
    return;
  }

  await CategoryModel.findByIdAndDelete(id);
  sendSuccess(res, { message: 'Category deleted successfully' });
}

// ----------------- TAGS -----------------
export async function getAdminTags(_req: Request, res: Response) {
  const tags = await TagModel.find().sort({ name: 1 }).lean();
  sendSuccess(res, tags);
}

export async function createTag(req: Request, res: Response) {
  const { name, slug } = req.body;
  const finalSlug = slugify(slug || name);

  const existing = await TagModel.findOne({ slug: finalSlug });
  if (existing) {
    sendError(res, 'Tag slug already exists', 409, 'DUPLICATE_SLUG');
    return;
  }

  const tag = await TagModel.create({ name, slug: finalSlug });
  sendSuccess(res, tag, 201);
}

export async function deleteTag(req: Request, res: Response) {
  const { id } = req.params;
  const tag = await TagModel.findByIdAndDelete(id);
  if (!tag) {
    sendError(res, 'Tag not found', 404, 'NOT_FOUND');
    return;
  }
  sendSuccess(res, { message: 'Tag deleted successfully' });
}

// ----------------- GAMES -----------------
export async function getAdminGames(_req: Request, res: Response) {
  const games = await GameModel.find().sort({ title: 1 }).lean();
  sendSuccess(res, games);
}

export async function createGame(req: Request, res: Response) {
  const body = req.body;
  const finalSlug = slugify(body.slug || body.title);

  const existing = await GameModel.findOne({ slug: finalSlug });
  if (existing) {
    sendError(res, 'Game slug already exists', 409, 'DUPLICATE_SLUG');
    return;
  }

  const game = await GameModel.create({ ...body, slug: finalSlug });
  sendSuccess(res, game, 201);
}

export async function updateGame(req: Request, res: Response) {
  const { id } = req.params;
  const body = req.body;

  if (body.slug) {
    body.slug = slugify(body.slug);
    const existing = await GameModel.findOne({ slug: body.slug, _id: { $ne: id } });
    if (existing) {
      sendError(res, 'Game slug already taken', 409, 'DUPLICATE_SLUG');
      return;
    }
  }

  const game = await GameModel.findByIdAndUpdate(id, body, { new: true });
  if (!game) {
    sendError(res, 'Game not found', 404, 'NOT_FOUND');
    return;
  }

  sendSuccess(res, game);
}

export async function deleteGame(req: Request, res: Response) {
  const { id } = req.params;
  const game = await GameModel.findById(id);

  if (!game) {
    sendError(res, 'Game not found', 404, 'NOT_FOUND');
    return;
  }

  // Check references in reviews or articles
  const [reviewsCount, articlesCount] = await Promise.all([
    ReviewModel.countDocuments({ gameId: game.slug }),
    ArticleModel.countDocuments({ gameId: game.slug }),
  ]);

  if (reviewsCount > 0 || articlesCount > 0) {
    sendError(res, `Cannot delete game: ${reviewsCount} reviews and ${articlesCount} articles are linked to it.`, 409, 'GAME_IN_USE');
    return;
  }

  await GameModel.findByIdAndDelete(id);
  sendSuccess(res, { message: 'Game deleted successfully' });
}

// ----------------- REVIEWS -----------------
export async function getAdminReviews(_req: Request, res: Response) {
  const reviews = await ReviewModel.find().sort({ publishedAt: -1 }).lean();
  sendSuccess(res, reviews);
}

export async function createReview(req: Request, res: Response) {
  const body = req.body;
  const finalSlug = slugify(body.slug || body.title);

  const existing = await ReviewModel.findOne({ slug: finalSlug });
  if (existing) {
    sendError(res, 'Review slug already exists', 409, 'DUPLICATE_SLUG');
    return;
  }

  const review = await ReviewModel.create({ ...body, slug: finalSlug });
  sendSuccess(res, review, 201);
}

export async function updateReview(req: Request, res: Response) {
  const { id } = req.params;
  const body = req.body;

  if (body.slug) {
    body.slug = slugify(body.slug);
    const existing = await ReviewModel.findOne({ slug: body.slug, _id: { $ne: id } });
    if (existing) {
      sendError(res, 'Review slug already taken', 409, 'DUPLICATE_SLUG');
      return;
    }
  }

  const review = await ReviewModel.findByIdAndUpdate(id, body, { new: true });
  if (!review) {
    sendError(res, 'Review not found', 404, 'NOT_FOUND');
    return;
  }

  sendSuccess(res, review);
}

export async function deleteReview(req: Request, res: Response) {
  const { id } = req.params;
  const review = await ReviewModel.findByIdAndDelete(id);
  if (!review) {
    sendError(res, 'Review not found', 404, 'NOT_FOUND');
    return;
  }
  sendSuccess(res, { message: 'Review deleted successfully' });
}

// ----------------- AUTHORS -----------------
export async function getAdminAuthors(_req: Request, res: Response) {
  const authors = await AuthorModel.find().sort({ name: 1 }).lean();
  sendSuccess(res, authors);
}

export async function createAuthor(req: Request, res: Response) {
  const body = req.body;
  const finalSlug = slugify(body.slug || body.name);

  const existing = await AuthorModel.findOne({ slug: finalSlug });
  if (existing) {
    sendError(res, 'Author slug already exists', 409, 'DUPLICATE_SLUG');
    return;
  }

  const author = await AuthorModel.create({ ...body, slug: finalSlug });
  sendSuccess(res, author, 201);
}

export async function updateAuthor(req: Request, res: Response) {
  const { id } = req.params;
  const body = req.body;

  if (body.slug) {
    body.slug = slugify(body.slug);
    const existing = await AuthorModel.findOne({ slug: body.slug, _id: { $ne: id } });
    if (existing) {
      sendError(res, 'Author slug already taken', 409, 'DUPLICATE_SLUG');
      return;
    }
  }

  const author = await AuthorModel.findByIdAndUpdate(id, body, { new: true });
  if (!author) {
    sendError(res, 'Author not found', 404, 'NOT_FOUND');
    return;
  }

  sendSuccess(res, author);
}

export async function deleteAuthor(req: Request, res: Response) {
  const { id } = req.params;
  const author = await AuthorModel.findById(id);

  if (!author) {
    sendError(res, 'Author not found', 404, 'NOT_FOUND');
    return;
  }

  const articleCount = await ArticleModel.countDocuments({ authorId: author.id });
  if (articleCount > 0) {
    sendError(res, `Cannot delete author: ${articleCount} articles are authored by this person. Reassign articles first.`, 409, 'AUTHOR_IN_USE');
    return;
  }

  await AuthorModel.findByIdAndDelete(id);
  sendSuccess(res, { message: 'Author deleted successfully' });
}

// ----------------- ADMIN USERS (super_admin only) -----------------
export async function getAdminUsers(_req: Request, res: Response) {
  const users = await AdminModel.find().sort({ createdAt: -1 }).lean();
  sendSuccess(res, users);
}

export async function createAdminUser(req: Request, res: Response) {
  const { email, password, name, role } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await AdminModel.findOne({ email: normalizedEmail });
  if (existing) {
    sendError(res, 'An administrator with this email already exists', 409, 'EMAIL_EXISTS');
    return;
  }

  const passwordHash = await AuthService.hashPassword(password);
  const user = await AdminModel.create({
    email: normalizedEmail,
    passwordHash,
    name,
    role: role || 'author',
    isActive: true,
  });

  sendSuccess(res, user, 201);
}

export async function updateAdminUser(req: Request, res: Response) {
  const { id } = req.params;
  const { name, role, isActive, password } = req.body;

  const user = await AdminModel.findById(id);
  if (!user) {
    sendError(res, 'Administrator not found', 404, 'NOT_FOUND');
    return;
  }

  if (name !== undefined) user.name = name;
  if (role !== undefined) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;
  if (password) {
    user.passwordHash = await AuthService.hashPassword(password);
  }

  await user.save();
  sendSuccess(res, user);
}

export async function deleteAdminUser(req: Request, res: Response) {
  const { id } = req.params;
  const currentAdmin = req.admin!;

  if (currentAdmin.id === id) {
    sendError(res, 'You cannot delete your own administrator account', 400, 'SELF_DELETE');
    return;
  }

  const user = await AdminModel.findByIdAndDelete(id);
  if (!user) {
    sendError(res, 'Administrator not found', 404, 'NOT_FOUND');
    return;
  }

  sendSuccess(res, { message: 'Administrator account deleted' });
}
