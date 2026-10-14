import { z } from 'zod';

const scoreBreakdownSchema = z.object({
  score: z.number().min(0).max(10),
  details: z.string().min(1, 'Score breakdown details required').trim(),
});

export const createReviewSchema = z.object({
  gameId: z.string().min(1, 'Game ID is required').trim(),
  slug: z.string().min(3).trim().toLowerCase().optional(),
  title: z.string().min(3, 'Title is required').trim(),
  score: z.number().min(0).max(10),
  verdict: z.string().min(10, 'Verdict must be at least 10 characters').trim(),
  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),
  gameplay: scoreBreakdownSchema,
  graphics: scoreBreakdownSchema,
  performance: scoreBreakdownSchema,
  audio: scoreBreakdownSchema,
  replayability: scoreBreakdownSchema,
  finalVerdict: z.string().min(10, 'Final verdict must be at least 10 characters').trim(),
  authorId: z.string().min(1, 'Author ID is required').trim(),
  coverImage: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('published'),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const updateReviewSchema = createReviewSchema.partial();
