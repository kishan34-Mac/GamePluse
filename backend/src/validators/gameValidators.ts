import { z } from 'zod';

export const createGameSchema = z.object({
  title: z.string().min(2, 'Title is required').trim(),
  slug: z.string().min(2).trim().toLowerCase().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').trim(),
  cover: z.string().min(1, 'Cover image is required'),
  heroImage: z.string().optional(),
  genre: z.string().min(2, 'Genre is required').trim(),
  platforms: z.array(z.string()).min(1, 'At least one platform is required'),
  developer: z.string().min(2, 'Developer is required').trim(),
  publisher: z.string().min(2, 'Publisher is required').trim(),
  releaseDate: z.string().min(2, 'Release date is required').trim(),
  score: z.number().min(0).max(10).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const updateGameSchema = createGameSchema.partial();
