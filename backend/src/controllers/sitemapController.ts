import { Request, Response } from 'express';
import { ArticleModel } from '../models/Article.js';
import { CategoryModel } from '../models/Category.js';
import { GameModel } from '../models/Game.js';
import { ReviewModel } from '../models/Review.js';
import { env } from '../config/env.js';

export async function getSitemap(_req: Request, res: Response) {
  const baseUrl = (env.SITE_URL || '').replace(/\/$/, '');

  const [articles, categories, games, reviews] = await Promise.all([
    ArticleModel.find({ status: 'published' }).select('slug category updatedAt publishedAt').lean(),
    CategoryModel.find({ status: 'active' }).select('slug updatedAt').lean(),
    GameModel.find().select('slug updatedAt').lean(),
    ReviewModel.find({ status: 'published' }).select('slug updatedAt publishedAt').lean(),
  ]);

  const urls: Array<{ loc: string; lastmod: string; changefreq: string; priority: string }> = [
    { loc: `${baseUrl}/`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'daily', priority: '1.0' },
  ];

  // Categories
  categories.forEach(cat => {
    urls.push({
      loc: `${baseUrl}/${cat.slug}`,
      lastmod: new Date(cat.updatedAt || Date.now()).toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.8',
    });
  });

  // Articles
  articles.forEach(art => {
    urls.push({
      loc: `${baseUrl}/${art.category}/${art.slug}`,
      lastmod: new Date(art.updatedAt || art.publishedAt || Date.now()).toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.9',
    });
  });

  // Reviews
  reviews.forEach(rev => {
    urls.push({
      loc: `${baseUrl}/reviews/${rev.slug}`,
      lastmod: new Date(rev.updatedAt || rev.publishedAt || Date.now()).toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.8',
    });
  });

  // Games
  games.forEach(game => {
    urls.push({
      loc: `${baseUrl}/games/${game.slug}`,
      lastmod: new Date(game.updatedAt || Date.now()).toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.7',
    });
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
}
