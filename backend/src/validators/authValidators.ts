import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

export const bootstrapSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bootstrapToken: z.string().min(1, 'Bootstrap token is required'),
});

export const createAdminSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  name: z.string().min(2, 'Name is required'),
  role: z.enum(['super_admin', 'editor', 'author']).default('author'),
});

export const updateAdminSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.enum(['super_admin', 'editor', 'author']).optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(8).optional(),
});
