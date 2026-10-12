export interface NavItem {
  label: string;
  href: string;
  category?: string;
  badge?: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export const BRAND = {
  name: 'GAMEPULSE',
  tagline: 'The Pulse of Gaming',
  subheading: 'Gaming journalism, reviews, guides, hardware coverage, and esports.',
  // Intentionally blank until a real production domain is configured.
  url: (import.meta.env.VITE_SITE_URL || '').replace(/\/$/, ''),
  author: 'GAMEPULSE Editorial Team',
  foundedYear: 2024,
  currentYear: new Date().getFullYear(),
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || '',
  editorialEmail: import.meta.env.VITE_EDITORIAL_EMAIL || '',
  advertisingEmail: import.meta.env.VITE_ADVERTISING_EMAIL || '',
  
  navigation: [
    { label: 'HOME', href: '/' },
    { label: 'NEWS', href: '/news', category: 'news' },
    { label: 'REVIEWS', href: '/reviews', category: 'reviews' },
    { label: 'GUIDES', href: '/guides', category: 'guides' },
    { label: 'PC GAMING', href: '/pc-gaming', category: 'pc-gaming' },
    { label: 'MOBILE GAMING', href: '/mobile-gaming', category: 'mobile-gaming' },
    { label: 'ESPORTS', href: '/esports', category: 'esports' },
  ] as NavItem[],

  trendingTopics: [
    { label: 'GTA 6', query: 'GTA 6' },
    { label: 'Steam Spring', query: 'Steam' },
    { label: 'PlayStation 5 Pro', query: 'PlayStation' },
    { label: 'Xbox Series Next', query: 'Xbox' },
    { label: 'Nintendo Switch 2', query: 'Nintendo' },
    { label: 'Valorant VCT', query: 'Valorant' },
    { label: 'Minecraft 1.21', query: 'Minecraft' },
    { label: 'BGMI Series', query: 'BGMI' },
    { label: 'Free Fire World', query: 'Free Fire' },
    { label: 'RTX 5090 Benchmarks', query: 'RTX' },
  ],

  // Add only verified, launched social profiles here.
  socialLinks: [] as SocialLink[],

  footerSections: {
    explore: [
      { label: 'News', href: '/news' },
      { label: 'Reviews', href: '/reviews' },
      { label: 'Guides', href: '/guides' },
      { label: 'PC Gaming', href: '/pc-gaming' },
      { label: 'Mobile Gaming', href: '/mobile-gaming' },
      { label: 'Esports', href: '/esports' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Editorial Team', href: '/about#editorial-team' },
      { label: 'Ethics & Standards', href: '/about#standards' },
      { label: 'Contact', href: '/contact' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Editorial Disclaimer', href: '/disclaimer' },
      { label: 'Affiliate Disclosure', href: '/disclaimer#affiliate' },
    ],
  },
};
