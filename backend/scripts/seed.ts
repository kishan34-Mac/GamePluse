import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import { CategoryModel } from '../src/models/Category.js';
import { TagModel } from '../src/models/Tag.js';
import { AuthorModel } from '../src/models/Author.js';
import { GameModel } from '../src/models/Game.js';
import { ReviewModel } from '../src/models/Review.js';
import { ArticleModel } from '../src/models/Article.js';
import { env } from '../src/config/env.js';
import { logger } from '../src/utils/logger.js';

// Import local editorial data directly from frontend
import { CATEGORIES } from '../../src/data/categories.js';
import { AUTHORS } from '../../src/data/authors.js';
import { GAMES } from '../../src/data/games.js';
import { REVIEWS } from '../../src/data/reviews.js';
import { ARTICLES } from '../../src/data/articles.js';

async function seed() {
  if (env.NODE_ENV === 'production' && !process.env.ALLOW_PRODUCTION_SEED) {
    logger.error('Safety guard: Seeding is strictly forbidden in production mode without explicit override.');
    process.exit(1);
  }

  logger.info('Starting GAMEPULSE development data seed...');
  await connectDatabase();

  try {
    // 1. Categories
    logger.info('Seeding categories...');
    for (const cat of CATEGORIES) {
      await CategoryModel.findOneAndUpdate(
        { slug: cat.slug },
        {
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          icon: cat.icon,
          heroImage: cat.heroImage,
          status: 'active',
        },
        { upsert: true, new: true }
      );
    }

    // 2. Authors
    logger.info('Seeding authors...');
    for (const author of AUTHORS) {
      await AuthorModel.findOneAndUpdate(
        { slug: author.id },
        {
          name: author.name,
          slug: author.id,
          bio: author.bio,
          avatar: author.avatar,
          role: author.role,
          socialLinks: author.socialLinks,
          isActive: true,
        },
        { upsert: true, new: true }
      );
    }

    // 3. Games
    logger.info('Seeding games...');
    for (const game of GAMES) {
      await GameModel.findOneAndUpdate(
        { slug: game.slug },
        {
          title: game.title,
          slug: game.slug,
          cover: game.cover,
          heroImage: game.heroImage || '',
          genre: game.genre,
          platforms: game.platforms,
          developer: game.developer,
          publisher: game.publisher,
          releaseDate: game.releaseDate,
          description: game.description,
          score: game.score,
        },
        { upsert: true, new: true }
      );
    }

    // 4. Reviews
    logger.info('Seeding reviews...');
    for (const review of REVIEWS) {
      await ReviewModel.findOneAndUpdate(
        { slug: review.slug },
        {
          gameId: review.gameId,
          slug: review.slug,
          title: review.title,
          score: review.score,
          verdict: review.verdict,
          pros: review.pros,
          cons: review.cons,
          gameplay: review.gameplay,
          graphics: review.graphics,
          performance: review.performance,
          audio: review.audio,
          replayability: review.replayability,
          finalVerdict: review.finalVerdict,
          authorId: review.authorId,
          publishedAt: new Date(review.publishedAt),
          coverImage: review.coverImage || '',
          status: 'published',
        },
        { upsert: true, new: true }
      );
    }

    // 5. Articles & Tags
    logger.info('Seeding articles and extracting tags...');
    const uniqueTags = new Set<string>();

    for (const article of ARTICLES) {
      (article.tags || []).forEach(t => uniqueTags.add(t));

      await ArticleModel.findOneAndUpdate(
        { slug: article.slug },
        {
          title: article.title,
          slug: article.slug,
          subtitle: article.subtitle,
          excerpt: article.excerpt,
          category: article.category,
          image: article.image,
          imageCaption: article.imageCaption,
          authorId: article.authorId,
          publishedAt: new Date(article.publishedAt),
          readingTime: article.readingTime,
          tags: article.tags,
          featured: Boolean(article.featured),
          trending: Boolean(article.trending),
          popular: Boolean(article.popular),
          editorsPick: Boolean(article.editorsPick),
          status: article.status || 'published',
          isSponsored: Boolean(article.isSponsored),
          sponsorName: article.sponsorName,
          sponsorDisclosure: article.sponsorDisclosure,
          seoTitle: article.seoTitle,
          seoDescription: article.seoDescription,
          canonicalUrl: article.canonicalUrl,
          contentBlocks: article.contentBlocks,
          tableOfContents: article.tableOfContents,
          faqs: article.faqs,
          gameId: article.gameId,
        },
        { upsert: true, new: true }
      );
    }

    // Seed Tags
    for (const tagName of uniqueTags) {
      const slug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      if (slug) {
        await TagModel.findOneAndUpdate(
          { slug },
          { name: tagName, slug },
          { upsert: true, new: true }
        );
      }
    }

    logger.info('Database seeded successfully with all editorial records!');
    // eslint-disable-next-line no-console
    console.log('Seed completed successfully!');
  } catch (error: any) {
    logger.error('Seed operation failed', { error: error.message });
    // eslint-disable-next-line no-console
    console.error('Seed error:', error);
    process.exit(1);
  } finally {
    await disconnectDatabase();
  }
}

seed();
