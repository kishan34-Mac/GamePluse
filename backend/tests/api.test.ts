import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import { AdminModel } from '../src/models/Admin.js';
import { ArticleModel } from '../src/models/Article.js';
import { AuthService } from '../src/services/authService.js';
import { NewsletterSubscriberModel } from '../src/models/NewsletterSubscriber.js';

describe('GAMEPULSE Backend End-to-End Test Suite', () => {
  const app = createApp();
  let superAdminToken: string;
  let authorToken: string;
  let authorAdminId: string;
  let anotherAuthorToken: string;
  let testArticleId: string;

  before(async () => {
    await connectDatabase();

    // Setup Test Admins
    await AdminModel.deleteMany({ email: { $in: ['test-author@gamepulse.io', 'test-author2@gamepulse.io'] } });

    // Create an Author Admin
    const authorHash = await AuthService.hashPassword('AuthorPass123!');
    const author = await AdminModel.create({
      email: 'test-author@gamepulse.io',
      passwordHash: authorHash,
      name: 'Test Author',
      role: 'author',
      isActive: true,
    });
    authorAdminId = author.id;
    authorToken = AuthService.generateToken({
      adminId: author.id,
      email: author.email,
      role: author.role,
      name: author.name,
    });

    // Create Second Author Admin
    const author2 = await AdminModel.create({
      email: 'test-author2@gamepulse.io',
      passwordHash: authorHash,
      name: 'Another Author',
      role: 'author',
      isActive: true,
    });
    anotherAuthorToken = AuthService.generateToken({
      adminId: author2.id,
      email: author2.email,
      role: author2.role,
      name: author2.name,
    });

    // Get Super Admin Token
    const superAdmin = await AdminModel.findOne({ role: 'super_admin' });
    if (superAdmin) {
      superAdminToken = AuthService.generateToken({
        adminId: superAdmin.id,
        email: superAdmin.email,
        role: superAdmin.role,
        name: superAdmin.name,
      });
    }
  });

  after(async () => {
    // Cleanup created test records
    await AdminModel.deleteMany({ email: { $in: ['test-author@gamepulse.io', 'test-author2@gamepulse.io'] } });
    if (testArticleId) {
      await ArticleModel.findByIdAndDelete(testArticleId);
    }
    await ArticleModel.deleteMany({ slug: { $regex: /^test-/ } });
    await NewsletterSubscriberModel.deleteMany({ email: { $regex: /^test-sub/ } });
    await disconnectDatabase();
  });

  // 1. Health Endpoint
  it('GET /api/v1/health returns ok status and uptime without secrets', async () => {
    const res = await request(app).get('/api/v1/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.status, 'ok');
    assert.equal(typeof res.body.data.uptime, 'number');
    assert.equal(res.body.data.database, 'connected');
    assert.equal(res.body.data.password, undefined);
    assert.equal(res.body.data.jwtSecret, undefined);
  });

  // 2. Authentication & Negative Tests
  it('POST /api/v1/admin/auth/login succeeds with valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/admin/auth/login')
      .send({ email: 'test-author@gamepulse.io', password: 'AuthorPass123!' });
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.token);
    assert.equal(res.body.data.admin.email, 'test-author@gamepulse.io');
    // Ensure password hash is not exposed
    assert.equal(res.body.data.admin.passwordHash, undefined);
  });

  it('POST /api/v1/admin/auth/login fails safely with generic error on invalid password', async () => {
    const res = await request(app)
      .post('/api/v1/admin/auth/login')
      .send({ email: 'test-author@gamepulse.io', password: 'WrongPassword999!' });
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
    assert.equal(res.body.code, 'INVALID_CREDENTIALS');
    assert.equal(res.body.message, 'Invalid email or password.');
  });

  it('POST /api/v1/admin/auth/login fails safely on non-existent account without account enumeration', async () => {
    const res = await request(app)
      .post('/api/v1/admin/auth/login')
      .send({ email: 'nonexistent-user-999@gamepulse.io', password: 'SomePassword123!' });
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
    assert.equal(res.body.code, 'INVALID_CREDENTIALS');
    assert.equal(res.body.message, 'Invalid email or password.');
  });

  it('GET /api/v1/admin/auth/me rejects unauthenticated requests', async () => {
    const res = await request(app).get('/api/v1/admin/auth/me');
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
    assert.equal(res.body.code, 'UNAUTHORIZED');
  });

  it('GET /api/v1/admin/auth/me returns current admin with valid token', async () => {
    const res = await request(app)
      .get('/api/v1/admin/auth/me')
      .set('Authorization', `Bearer ${authorToken}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.email, 'test-author@gamepulse.io');
  });

  // 3. Draft Privacy & Public Access
  it('Public GET /api/v1/articles only returns published articles and excludes drafts', async () => {
    // Create a draft article first
    const draft = await ArticleModel.create({
      title: 'Secret Unreleased Draft Article',
      slug: 'test-secret-unreleased-draft',
      excerpt: 'This draft should never appear in public feeds.',
      category: 'news',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e',
      authorId: authorAdminId,
      status: 'draft',
      readingTime: '2 min read',
    });

    const res = await request(app).get('/api/v1/articles');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    const slugs = res.body.data.map((a: any) => a.slug);
    assert.ok(!slugs.includes('test-secret-unreleased-draft'), 'Draft slug must not appear in public articles');

    // Attempt direct slug lookup on draft
    const directRes = await request(app).get('/api/v1/articles/test-secret-unreleased-draft');
    assert.equal(directRes.status, 404, 'Direct access to draft slug must return 404');

    // Cleanup draft
    await ArticleModel.findByIdAndDelete(draft.id);
  });

  // 4. Article CRUD & RBAC Authorization
  it('Author can create a draft article', async () => {
    const res = await request(app)
      .post('/api/v1/admin/articles')
      .set('Authorization', `Bearer ${authorToken}`)
      .send({
        title: 'Test Author Article Title',
        slug: 'test-author-article-title',
        excerpt: 'An excerpt for our automated test article.',
        category: 'news',
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e',
        status: 'draft',
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.status, 'draft');
    assert.equal(res.body.data.authorId, authorAdminId);
    testArticleId = res.body.data.id;
  });

  it('Duplicate slug creation is rejected with 409 DUPLICATE_SLUG', async () => {
    const res = await request(app)
      .post('/api/v1/admin/articles')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        title: 'Duplicate Slug Test Article',
        slug: 'test-author-article-title', // duplicate of previous
        excerpt: 'Trying to create an article with a duplicate slug.',
        category: 'news',
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e',
        status: 'draft',
      });

    assert.equal(res.status, 409);
    assert.equal(res.body.code, 'DUPLICATE_SLUG');
  });

  it('CRITICAL NEGATIVE: Author cannot modify another author’s article', async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/articles/${testArticleId}`)
      .set('Authorization', `Bearer ${anotherAuthorToken}`)
      .send({ title: 'Hacked Title By Other Author' });

    assert.equal(res.status, 403);
    assert.equal(res.body.code, 'FORBIDDEN');
  });

  it('CRITICAL NEGATIVE: Author cannot directly publish an article', async () => {
    const res = await request(app)
      .post(`/api/v1/admin/articles/${testArticleId}/publish`)
      .set('Authorization', `Bearer ${authorToken}`);

    assert.equal(res.status, 403);
    assert.equal(res.body.code, 'FORBIDDEN');
  });

  it('Super admin can publish an article', async () => {
    const res = await request(app)
      .post(`/api/v1/admin/articles/${testArticleId}/publish`)
      .set('Authorization', `Bearer ${superAdminToken}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.data.status, 'published');
    assert.ok(res.body.data.publishedAt);
  });

  it('Published article is now accessible via public slug endpoint', async () => {
    const res = await request(app).get('/api/v1/articles/test-author-article-title');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.slug, 'test-author-article-title');
  });

  // 5. Pagination & Category Filtering
  it('GET /api/v1/articles respects category filter and pagination metadata', async () => {
    const res = await request(app).get('/api/v1/articles?category=news&page=1&limit=2');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.data.length <= 2);
    assert.equal(res.body.pagination.page, 1);
    assert.equal(res.body.pagination.limit, 2);
    assert.ok(typeof res.body.pagination.total === 'number');
    res.body.data.forEach((art: any) => {
      assert.equal(art.category, 'news');
    });
  });

  // 6. Public Search
  it('GET /api/v1/search finds articles by keyword safely', async () => {
    const res = await request(app).get('/api/v1/search?q=GTA');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.data.length > 0);
  });

  // 7. Categories, Games, Reviews APIs
  it('GET /api/v1/categories returns list of active categories', async () => {
    const res = await request(app).get('/api/v1/categories');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.data.length > 0);
  });

  it('GET /api/v1/games returns games list', async () => {
    const res = await request(app).get('/api/v1/games');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.data.length > 0);
  });

  it('GET /api/v1/reviews returns published reviews', async () => {
    const res = await request(app).get('/api/v1/reviews');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.data.length > 0);
  });

  // 8. Newsletter Integration & Duplicate Handling
  it('POST /api/v1/newsletter/subscribe registers a new subscriber with consent', async () => {
    const res = await request(app)
      .post('/api/v1/newsletter/subscribe')
      .send({ email: 'test-subscriber-01@gamepulse.io', consent: true });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.status, 'subscribed');
  });

  it('POST /api/v1/newsletter/subscribe handles duplicates gracefully without error leakage', async () => {
    const res = await request(app)
      .post('/api/v1/newsletter/subscribe')
      .send({ email: 'test-subscriber-01@gamepulse.io', consent: true });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.status, 'already_subscribed');
  });

  it('POST /api/v1/newsletter/subscribe rejects requests without consent', async () => {
    const res = await request(app)
      .post('/api/v1/newsletter/subscribe')
      .send({ email: 'test-noconsent@gamepulse.io', consent: false });

    assert.equal(res.status, 422);
    assert.equal(res.body.code, 'VALIDATION_ERROR');
  });

  // 9. Media Upload Unconfigured Handling
  it('POST /api/v1/admin/media/upload returns clean 503 when Cloudinary is unconfigured', async () => {
    const res = await request(app)
      .post('/api/v1/admin/media/upload')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .attach('file', Buffer.from('fake image content'), 'test.png');

    // In dev without cloudinary keys, should report 503 MEDIA_SERVICE_NOT_CONFIGURED
    assert.equal(res.status, 503);
    assert.equal(res.body.code, 'MEDIA_SERVICE_NOT_CONFIGURED');
  });

  // 10. Sitemap Generator
  it('GET /api/v1/sitemap.xml returns valid XML sitemap of published content', async () => {
    const res = await request(app).get('/api/v1/sitemap.xml');
    assert.equal(res.status, 200);
    assert.equal(res.headers['content-type'], 'application/xml; charset=utf-8');
    assert.match(res.text, /<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">/);
    assert.match(res.text, /<loc>/);
  });
});
