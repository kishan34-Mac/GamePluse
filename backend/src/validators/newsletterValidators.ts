import { z } from 'zod';

export const subscribeNewsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'You must consent to receive newsletter updates.' }),
  }),
  source: z.string().optional().default('website_footer'),
  website: z.string().max(0, 'Spam detected').optional(), // honeypot field
});
