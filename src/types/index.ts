export type CategorySlug = 
  | 'news' 
  | 'reviews' 
  | 'guides' 
  | 'pc-gaming' 
  | 'mobile-gaming' 
  | 'esports';

export type ArticleStatus = 'draft' | 'published' | 'scheduled';

export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  role: string;
  socialLinks?: {
    twitter?: string;
    email?: string;
    website?: string;
  };
}

export interface TableOfContentItem {
  id: string;
  title: string;
  level: 2 | 3;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export type ContentBlockType = 
  | 'paragraph'
  | 'heading'
  | 'image'
  | 'quote'
  | 'highlight'
  | 'infobox'
  | 'warningbox'
  | 'proscons'
  | 'video'
  | 'affiliate'
  | 'faq';

export interface ContentBlock {
  type: ContentBlockType;
  text?: string;
  level?: 2 | 3 | 4;
  id?: string;
  src?: string;
  alt?: string;
  caption?: string;
  author?: string;
  role?: string;
  title?: string;
  pros?: string[];
  cons?: string[];
  videoId?: string;
  productId?: string;
  faqs?: FAQItem[];
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  category: CategorySlug;
  image: string;
  imageCaption?: string;
  authorId: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: string;
  tags: string[];
  featured?: boolean;
  trending?: boolean;
  popular?: boolean;
  editorsPick?: boolean;
  
  // Future CMS & Sponsorship ready
  status: ArticleStatus;
  isSponsored?: boolean;
  sponsorName?: string;
  sponsorDisclosure?: string;
  
  // Future SEO metadata
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;

  // Structured content & deep article support
  contentBlocks?: ContentBlock[];
  rawContent?: string;
  tableOfContents?: TableOfContentItem[];
  faqs?: FAQItem[];
  gameId?: string;
}

export interface Game {
  id: string;
  slug: string;
  title: string;
  cover: string;
  heroImage?: string;
  genre: string;
  platforms: string[];
  developer: string;
  publisher: string;
  releaseDate: string;
  description: string;
  score?: number;
}

export interface ReviewScoreBreakdown {
  score: number;
  details: string;
}

export interface Review {
  id: string;
  gameId: string;
  slug: string;
  title: string;
  score: number; // 0 - 10, e.g. 9.5
  verdict: string;
  pros: string[];
  cons: string[];
  gameplay: ReviewScoreBreakdown;
  graphics: ReviewScoreBreakdown;
  performance: ReviewScoreBreakdown;
  audio: ReviewScoreBreakdown;
  replayability: ReviewScoreBreakdown;
  finalVerdict: string;
  authorId: string;
  publishedAt: string;
  coverImage?: string;
}

export interface Category {
  id: string;
  slug: CategorySlug;
  name: string;
  description: string;
  icon: string;
  heroImage: string;
}

export type ProductCategory = 
  | 'mouse' 
  | 'keyboard' 
  | 'headset' 
  | 'controller' 
  | 'monitor' 
  | 'laptop' 
  | 'gpu' 
  | 'chair';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  pricePlaceholder: string;
  image: string;
  rating: number;
  badge?: string;
  specs: string[];
  affiliateUrl: string | null;
}
