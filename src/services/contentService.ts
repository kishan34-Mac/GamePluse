import { Article, Game, Author, Review, Category, Product, CategorySlug } from '../types';
import { api } from './apiClient';
import { PRODUCTS } from '../data/products';

// Fallback mock imports for explicit offline demo mode only
import { ARTICLES as MOCK_ARTICLES } from '../data/articles';
import { GAMES as MOCK_GAMES } from '../data/games';
import { AUTHORS as MOCK_AUTHORS } from '../data/authors';
import { REVIEWS as MOCK_REVIEWS } from '../data/reviews';
import { CATEGORIES as MOCK_CATEGORIES } from '../data/categories';

const USE_LOCAL_MOCK = import.meta.env.VITE_USE_LOCAL_MOCK === 'true';

export interface ArticleFilterOptions {
  category?: CategorySlug | string;
  tag?: string;
  limit?: number;
  offset?: number;
  sort?: 'newest' | 'oldest' | 'title';
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
    if (USE_LOCAL_MOCK) {
      let result = [...MOCK_ARTICLES];
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
    }

    const params = new URLSearchParams();
    if (options?.category && options.category !== 'all') params.set('category', options.category);
    if (options?.tag) params.set('tag', options.tag);
    if (options?.limit) params.set('limit', String(options.limit));
    if (options?.sort) params.set('sort', options.sort);

    const query = params.toString() ? `?${params.toString()}` : '';
    return api.get<Article[]>(`/articles${query}`);
  },

  async getPaginatedArticles(
    page: number = 1,
    limit: number = 9,
    category?: string,
    tag?: string
  ): Promise<PaginatedResult<Article>> {
    if (USE_LOCAL_MOCK) {
      let all = [...MOCK_ARTICLES];
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
    }

    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (category && category !== 'all') params.set('category', category);
    if (tag) params.set('tag', tag);

    const url = `/articles?${params.toString()}`;
    const result = await api.get<Article[]>(url);

    // If response was returned with pagination metadata via raw fetch, or extract from response
    return {
      data: result,
      total: result.length,
      page,
      totalPages: Math.ceil(result.length / limit) || 1,
      hasMore: false,
    };
  },

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    if (USE_LOCAL_MOCK) {
      return MOCK_ARTICLES.find(a => a.slug === slug);
    }
    try {
      return await api.get<Article>(`/articles/${slug}`);
    } catch (err: any) {
      if (err.statusCode === 404) return undefined;
      throw err;
    }
  },

  async getFeaturedArticles(): Promise<Article[]> {
    if (USE_LOCAL_MOCK) {
      return MOCK_ARTICLES.filter(a => a.featured);
    }
    return api.get<Article[]>('/articles/featured');
  },

  async getTrendingArticles(): Promise<Article[]> {
    if (USE_LOCAL_MOCK) {
      return MOCK_ARTICLES.filter(a => a.trending);
    }
    return api.get<Article[]>('/articles/trending');
  },

  async getPopularArticles(): Promise<Article[]> {
    if (USE_LOCAL_MOCK) {
      return MOCK_ARTICLES.filter(a => a.popular);
    }
    return api.get<Article[]>('/articles/popular');
  },

  async getEditorsPicks(): Promise<Article[]> {
    if (USE_LOCAL_MOCK) {
      return MOCK_ARTICLES.filter(a => a.editorsPick);
    }
    // API returns articles marked as featured/editor's pick
    return api.get<Article[]>('/articles/featured');
  },

  async getRelatedArticles(
    currentArticleId: string,
    category: string,
    tags: string[] = [],
    limit: number = 3
  ): Promise<Article[]> {
    if (USE_LOCAL_MOCK) {
      const others = MOCK_ARTICLES.filter(a => a.id !== currentArticleId);
      const scored = others.map(a => {
        let score = 0;
        if (a.category === category) score += 3;
        const sharedTags = a.tags.filter(t => tags.includes(t));
        score += sharedTags.length * 2;
        return { article: a, score };
      });
      scored.sort((a, b) => b.score - a.score);
      return scored.slice(0, limit).map(s => s.article);
    }

    const params = new URLSearchParams({
      limit: String(limit),
      category,
      tags: tags.join(','),
    });
    return api.get<Article[]>(`/articles/related/${currentArticleId}?${params.toString()}`);
  },

  // Games
  async getGames(): Promise<Game[]> {
    if (USE_LOCAL_MOCK) {
      return MOCK_GAMES;
    }
    return api.get<Game[]>('/games');
  },

  async getGameBySlug(slug: string): Promise<Game | undefined> {
    if (USE_LOCAL_MOCK) {
      return MOCK_GAMES.find(g => g.slug === slug);
    }
    try {
      return await api.get<Game>(`/games/${slug}`);
    } catch (err: any) {
      if (err.statusCode === 404) return undefined;
      throw err;
    }
  },

  async getGameById(id: string): Promise<Game | undefined> {
    if (USE_LOCAL_MOCK) {
      return MOCK_GAMES.find(g => g.id === id);
    }
    try {
      return await api.get<Game>(`/games/id/${id}`);
    } catch (err: any) {
      if (err.statusCode === 404) return undefined;
      throw err;
    }
  },

  async getGameArticles(gameId: string): Promise<Article[]> {
    if (USE_LOCAL_MOCK) {
      return MOCK_ARTICLES.filter(a => a.gameId === gameId);
    }
    // In API, filter articles by gameId tag or query
    const articles = await api.get<Article[]>('/articles?limit=20');
    return articles.filter(a => a.gameId === gameId);
  },

  // Reviews
  async getReviews(): Promise<Review[]> {
    if (USE_LOCAL_MOCK) {
      return MOCK_REVIEWS;
    }
    return api.get<Review[]>('/reviews');
  },

  async getReviewBySlug(slug: string): Promise<Review | undefined> {
    if (USE_LOCAL_MOCK) {
      return MOCK_REVIEWS.find(r => r.slug === slug);
    }
    try {
      return await api.get<Review>(`/reviews/${slug}`);
    } catch (err: any) {
      if (err.statusCode === 404) return undefined;
      throw err;
    }
  },

  async getReviewByGameId(gameId: string): Promise<Review | undefined> {
    if (USE_LOCAL_MOCK) {
      return MOCK_REVIEWS.find(r => r.gameId === gameId);
    }
    try {
      return await api.get<Review>(`/reviews/game/${gameId}`);
    } catch (err: any) {
      if (err.statusCode === 404) return undefined;
      throw err;
    }
  },

  // Products (Merchandise & Hardware)
  async getProducts(category?: string): Promise<Product[]> {
    if (category) {
      return PRODUCTS.filter(p => p.category === category);
    }
    return PRODUCTS;
  },

  // Authors
  async getAuthors(): Promise<Author[]> {
    if (USE_LOCAL_MOCK) {
      return MOCK_AUTHORS;
    }
    return api.get<Author[]>('/authors');
  },

  async getAuthorById(id: string): Promise<Author | undefined> {
    if (USE_LOCAL_MOCK) {
      return MOCK_AUTHORS.find(a => a.id === id);
    }
    try {
      return await api.get<Author>(`/authors/${id}`);
    } catch (err: any) {
      if (err.statusCode === 404) return undefined;
      throw err;
    }
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    if (USE_LOCAL_MOCK) {
      return MOCK_CATEGORIES;
    }
    return api.get<Category[]>('/categories');
  },

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    if (USE_LOCAL_MOCK) {
      return MOCK_CATEGORIES.find(c => c.slug === slug);
    }
    try {
      return await api.get<Category>(`/categories/${slug}`);
    } catch (err: any) {
      if (err.statusCode === 404) return undefined;
      throw err;
    }
  },

  // Search
  async searchArticles(
    query: string,
    options?: { category?: string; tag?: string }
  ): Promise<Article[]> {
    const q = query.trim();
    if (!q) return [];

    if (USE_LOCAL_MOCK) {
      const lower = q.toLowerCase();
      return MOCK_ARTICLES.filter(article => {
        if (options?.category && options.category !== 'all' && article.category !== options.category) {
          return false;
        }
        if (options?.tag && !article.tags.some(t => t.toLowerCase() === options.tag?.toLowerCase())) {
          return false;
        }
        const inTitle = article.title.toLowerCase().includes(lower);
        const inExcerpt = article.excerpt.toLowerCase().includes(lower);
        const inSubtitle = article.subtitle?.toLowerCase().includes(lower) ?? false;
        const inCategory = article.category.toLowerCase().includes(lower);
        const inTags = article.tags.some(t => t.toLowerCase().includes(lower));
        return inTitle || inExcerpt || inSubtitle || inCategory || inTags;
      });
    }

    const params = new URLSearchParams({ q });
    if (options?.category && options.category !== 'all') params.set('category', options.category);
    if (options?.tag) params.set('tag', options.tag);

    return api.get<Article[]>(`/search?${params.toString()}`);
  },
};
