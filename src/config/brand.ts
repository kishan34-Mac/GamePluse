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
  subheading: 'Premium gaming journalism, breaking industry news, deep-dive reviews, hardware benchmarks, and esports coverage.',
  url: 'https://gamepulse.media',
  author: 'GAMEPULSE Editorial Team',
  foundedYear: 2024,
  currentYear: new Date().getFullYear(),
  contactEmail: 'press@gamepulse.media',
  editorialEmail: 'editor@gamepulse.media',
  advertisingEmail: 'advertise@gamepulse.media',
  
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

  socialLinks: [
    { name: 'X / Twitter', url: 'https://twitter.com/gamepulse', icon: 'Twitter' },
    { name: 'YouTube', url: 'https://youtube.com/@gamepulse', icon: 'Youtube' },
    { name: 'Instagram', url: 'https://instagram.com/gamepulse', icon: 'Instagram' },
    { name: 'Facebook', url: 'https://facebook.com/gamepulse', icon: 'Facebook' },
    { name: 'Reddit', url: 'https://reddit.com/r/gamepulse', icon: 'Reddit' },
  ] as SocialLink[],

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
