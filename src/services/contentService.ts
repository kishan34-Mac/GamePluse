import { Article, Game, Author, Review, Category, Product, CategorySlug } from '../types';
import { ARTICLES } from '../data/articles';
import { GAMES } from '../data/games';
import { AUTHORS } from '../data/authors';
import { REVIEWS } from '../data/reviews';
import { CATEGORIES } from '../data/categories';
import { PRODUCTS } from '../data/products';

export interface ArticleFilterOptions {
  category?: CategorySlug | string;
  tag?: string;
  limit?: number;
  offset?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export const contentService = {
  // Articles
  async getArticles(options?: ArticleFilterOptions): Promise<Article[]> {
    let result = [...ARTICLES];
    if (options?.category && options.category !== 'all') {
      result = result.filter(a => a.category === options.category);
    }
    if (options?.tag) {
      result = result.filter(a => a.tags.some(t => t.toLowerCase() === options.tag?.toLowerCase()));
    }
    if (options?.offset) {
      result = result.slice(options.offset);
    }
    if (options?.limit) {
      result = result.slice(0, options.limit);
    }
    return result;
  },

  async getPaginatedArticles(
    page: number = 1,
    limit: number = 9,
    category?: string,
    tag?: string
  ): Promise<PaginatedResult<Article>> {
    let all = [...ARTICLES];
    if (category && category !== 'all') {
      all = all.filter(a => a.category === category);
    }
    if (tag) {
      all = all.filter(a => a.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
    }
    const total = all.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = all.slice(startIndex, startIndex + limit);

    return {
      data: paginated,
      total,
      page,
      totalPages,
      hasMore: page < totalPages,
    };
  },

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    return ARTICLES.find(a => a.slug === slug);
  },

  async getFeaturedArticles(): Promise<Article[]> {
    return ARTICLES.filter(a => a.featured);
  },

  async getTrendingArticles(): Promise<Article[]> {
    return ARTICLES.filter(a => a.trending);
  },

  async getPopularArticles(): Promise<Article[]> {
    return ARTICLES.filter(a => a.popular);
  },

  async getEditorsPicks(): Promise<Article[]> {
    return ARTICLES.filter(a => a.editorsPick);
  },

  async getRelatedArticles(
    currentArticleId: string,
    category: string,
    tags: string[] = [],
    limit: number = 3
  ): Promise<Article[]> {
    const others = ARTICLES.filter(a => a.id !== currentArticleId);
    
    // Score based on matching category and shared tags
    const scored = others.map(a => {
      let score = 0;
      if (a.category === category) score += 3;
      const sharedTags = a.tags.filter(t => tags.includes(t));
      score += sharedTags.length * 2;
      return { article: a, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map(s => s.article);
  },

  // Games
  async getGames(): Promise<Game[]> {
    return GAMES;
  },

  async getGameBySlug(slug: string): Promise<Game | undefined> {
    return GAMES.find(g => g.slug === slug);
  },

  async getGameById(id: string): Promise<Game | undefined> {
    return GAMES.find(g => g.id === id);
  },

  async getGameArticles(gameId: string): Promise<Article[]> {
    return ARTICLES.filter(a => a.gameId === gameId);
  },

  // Reviews
  async getReviews(): Promise<Review[]> {
    return REVIEWS;
  },

  async getReviewBySlug(slug: string): Promise<Review | undefined> {
    return REVIEWS.find(r => r.slug === slug);
  },

  async getReviewByGameId(gameId: string): Promise<Review | undefined> {
    return REVIEWS.find(r => r.gameId === gameId);
  },

  // Products
  async getProducts(category?: string): Promise<Product[]> {
    if (category) {
      return PRODUCTS.filter(p => p.category === category);
    }
    return PRODUCTS;
  },

  // Authors
  async getAuthors(): Promise<Author[]> {
    return AUTHORS;
  },

  async getAuthorById(id: string): Promise<Author | undefined> {
    return AUTHORS.find(a => a.id === id);
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    return CATEGORIES;
  },

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return CATEGORIES.find(c => c.slug === slug);
  },

  // Search
  async searchArticles(
    query: string,
    options?: { category?: string; tag?: string }
  ): Promise<Article[]> {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return ARTICLES.filter(article => {
      if (options?.category && options.category !== 'all' && article.category !== options.category) {
        return false;
      }
      if (options?.tag && !article.tags.some(t => t.toLowerCase() === options.tag?.toLowerCase())) {
        return false;
      }

      const inTitle = article.title.toLowerCase().includes(q);
      const inExcerpt = article.excerpt.toLowerCase().includes(q);
      const inSubtitle = article.subtitle?.toLowerCase().includes(q) ?? false;
      const inCategory = article.category.toLowerCase().includes(q);
      const inTags = article.tags.some(t => t.toLowerCase().includes(q));

      return inTitle || inExcerpt || inSubtitle || inCategory || inTags;
    });
  },
};
