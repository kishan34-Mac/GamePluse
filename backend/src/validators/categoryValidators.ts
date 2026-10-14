import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2, 'Name is required').trim(),
  slug: z.string().min(2).trim().toLowerCase().optional(),
  description: z.string().optional().default(''),
  icon: z.string().optional().default('BookOpen'),
  heroImage: z.string().optional().default(''),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  status: z.enum(['active', 'archived']).default('active'),
});

export const updateCategorySchema = createCategorySchema.partial();

export const createTagSchema = z.object({
  name: z.string().min(2, 'Tag name is required').trim(),
  slug: z.string().min(2).trim().toLowerCase().optional(),
});

export const createAuthorSchema = z.object({
  name: z.string().min(2, 'Author name is required').trim(),
  slug: z.string().min(2).trim().toLowerCase().optional(),
  bio: z.string().optional().default(''),
  avatar: z.string().optional().default(''),
  role: z.string().optional().default('Staff Writer'),
  socialLinks: z
    .object({
      twitter: z.string().optional(),
      email: z.string().email().optional(),
      website: z.string().url().optional(),
    })
    .optional(),
  isActive: z.boolean().default(true),
});

export const updateAuthorSchema = createAuthorSchema.partial();
