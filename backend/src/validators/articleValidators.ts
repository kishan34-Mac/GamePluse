import { z } from 'zod';

const contentBlockSchema = z.object({
  type: z.string(),
  text: z.string().optional(),
  level: z.number().optional(),
  id: z.string().optional(),
  src: z.string().optional(),
  alt: z.string().optional(),
  caption: z.string().optional(),
  author: z.string().optional(),
  role: z.string().optional(),
  title: z.string().optional(),
  pros: z.array(z.string()).optional(),
  cons: z.array(z.string()).optional(),
  videoId: z.string().optional(),
  productId: z.string().optional(),
  faqs: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    )
    .optional(),
});

const tableOfContentItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  level: z.union([z.literal(2), z.literal(3)]),
});

const faqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const createArticleSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').trim(),
  slug: z.string().min(3).trim().toLowerCase().optional(),
  subtitle: z.string().trim().optional(),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters').trim(),
  category: z.string().min(2, 'Category is required').trim().toLowerCase(),
  image: z.string().min(1, 'Featured image is required'),
  imageCaption: z.string().trim().optional(),
  authorId: z.string().trim().optional(),
  readingTime: z.string().trim().optional(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  trending: z.boolean().default(false),
  popular: z.boolean().default(false),
  editorsPick: z.boolean().default(false),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  isSponsored: z.boolean().default(false),
  sponsorName: z.string().trim().optional(),
  sponsorDisclosure: z.string().trim().optional(),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
  canonicalUrl: z.string().trim().optional(),
  contentBlocks: z.array(contentBlockSchema).optional(),
  rawContent: z.string().optional(),
  tableOfContents: z.array(tableOfContentItemSchema).optional(),
  faqs: z.array(faqItemSchema).optional(),
  gameId: z.string().trim().optional(),
  publishedAt: z.string().datetime().optional(),
});

export const updateArticleSchema = createArticleSchema.partial();

export const articleQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(9),
  category: z.string().optional(),
  tag: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  featured: z.coerce.boolean().optional(),
  trending: z.coerce.boolean().optional(),
  popular: z.coerce.boolean().optional(),
  sort: z.enum(['newest', 'oldest', 'title']).default('newest'),
  search: z.string().max(100).optional(),
});
