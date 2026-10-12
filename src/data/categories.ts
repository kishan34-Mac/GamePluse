import { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'cat-news',
    slug: 'news',
    name: 'Gaming News',
    description: 'Reports, studio acquisitions, release dates, and industry updates from across the video game landscape.',
    icon: 'Newspaper',
    heroImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'cat-reviews',
    slug: 'reviews',
    name: 'Reviews',
    description: 'Comprehensive, critical reviews and editorial scoring of the latest AAA blockbusters and standout indie titles.',
    icon: 'Star',
    heroImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'cat-guides',
    slug: 'guides',
    name: 'Guides & Walkthroughs',
    description: 'Expert tips, step-by-step walkthroughs, boss strategies, weapon builds, and hidden easter egg discoveries.',
    icon: 'BookOpen',
    heroImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'cat-pc-gaming',
    slug: 'pc-gaming',
    name: 'PC Gaming',
    description: 'Hardware deep dives, graphics card benchmarks, custom PC builds, driver optimizations, and Steam spotlight.',
    icon: 'Monitor',
    heroImage: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'cat-mobile-gaming',
    slug: 'mobile-gaming',
    name: 'Mobile Gaming',
    description: 'iOS and Android game coverage, mobile esports, device optimization, controller accessories, and portable hits.',
    icon: 'Smartphone',
    heroImage: 'https://images.unsplash.com/photo-1556438064-2d7646166914?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'cat-esports',
    slug: 'esports',
    name: 'Esports & Competitive',
    description: 'Live tournament coverage, roster changes, major championships, META breakdowns, and pro player interviews.',
    icon: 'Trophy',
    heroImage: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=1600&q=80',
  },
];

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return CATEGORIES.find(cat => cat.slug === slug);
};
