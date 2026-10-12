import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const values = (source, pattern) => [...source.matchAll(pattern)].map(match => match[1]);
const assertUnique = (label, items) => {
  assert.equal(new Set(items).size, items.length, `${label} must be unique`);
};

const articles = read('src/data/articles.ts');
const authors = read('src/data/authors.ts');
const categories = read('src/data/categories.ts');
const games = read('src/data/games.ts');
const reviews = read('src/data/reviews.ts');
const products = read('src/data/products.ts');
const app = read('src/App.tsx');

test('local editorial records have unique IDs and slugs', () => {
  const articleIds = values(articles, /id: '(art-[^']+)'/g);
  const articleSlugs = values(articles, /id: 'art-[^']+',\s*\n\s*slug: '([^']+)'/g);
  const gameIds = values(games, /id: '(game-[^']+)'/g);
  const gameSlugs = values(games, /id: 'game-[^']+',\s*\n\s*slug: '([^']+)'/g);
  const reviewIds = values(reviews, /id: '(rev-[^']+)'/g);
  const reviewSlugs = values(reviews, /gameId: '[^']+',\s*\n\s*slug: '([^']+)'/g);
  const authorIds = values(authors, /id: '(author-[^']+)'/g);
  const categorySlugs = values(categories, /slug: '([^']+)'/g);

  [
    ['article IDs', articleIds], ['article slugs', articleSlugs],
    ['game IDs', gameIds], ['game slugs', gameSlugs],
    ['review IDs', reviewIds], ['review slugs', reviewSlugs],
    ['author IDs', authorIds], ['category slugs', categorySlugs],
  ].forEach(([label, items]) => assertUnique(label, items));
});

test('article authors, categories, and game references resolve', () => {
  const authorIds = new Set(values(authors, /id: '(author-[^']+)'/g));
  const categorySlugs = new Set(values(categories, /slug: '([^']+)'/g));
  const gameIds = new Set(values(games, /id: '(game-[^']+)'/g));
  const articleAuthorIds = values(articles, /authorId: '([^']+)'/g);
  const articleGameIds = values(articles, /gameId: '([^']+)'/g);
  const articleCategories = values(articles, /category: '([^']+)'/g);

  articleAuthorIds.forEach(id => assert.ok(authorIds.has(id), `missing author ${id}`));
  articleGameIds.forEach(id => assert.ok(gameIds.has(id), `missing game ${id}`));
  articleCategories.forEach(slug => assert.ok(categorySlugs.has(slug), `missing category ${slug}`));
});

test('all published content has a supported application route', () => {
  const categorySlugs = values(categories, /slug: '([^']+)'/g);
  categorySlugs.forEach(slug => assert.match(app, new RegExp(`path="${slug}"`)));

  const reviewGameIds = new Set(values(reviews, /gameId: '([^']+)'/g));
  const articleCategories = values(articles, /category: '([^']+)'/g);
  articleCategories.forEach(category => assert.match(app, new RegExp(`path="${category}/:slug"`)));
  const reviewArticleGameIds = values(
    articles,
    /category: 'reviews'[\s\S]*?gameId: '([^']+)'/g
  );
  reviewArticleGameIds.forEach(id => assert.ok(reviewGameIds.has(id), `review article lacks review ${id}`));
  assert.match(app, /path="reviews\/:slug"/);
  assert.match(app, /path="games\/:slug"/);
});

test('product cards do not include placeholder affiliate destinations', () => {
  assert.equal(values(products, /affiliateUrl: (null|'[^']*')/g).length, 8);
  assert.doesNotMatch(products, /affiliateUrl: 'https?:\/\//);
});
