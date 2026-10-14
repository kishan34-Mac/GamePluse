# GAMEPULSE Backend & CMS API

Enterprise-grade REST API and Content Management System backend for the GAMEPULSE gaming media publication. Built with Node.js, Express, MongoDB (Mongoose), TypeScript, and Zod.

## Technology Stack

- **Runtime**: Node.js (>= 20.x, tested on v26.7.0)
- **Framework**: Express 4.x
- **Database**: MongoDB (v7+ / v8+) with Mongoose 8.x
- **Language**: TypeScript 5.8 with strict type checking
- **Validation**: Zod 3.24
- **Security**: Argon2/Bcrypt password hashing, Helmet, CORS, Express-Rate-Limit, HttpOnly Cookies
- **Media**: Cloudinary CDN (optional in dev, integrated when configured)
- **Logging**: Structured JSON logger with sensitive data redaction

## Architecture Overview

```
backend/
  src/
    config/          # Environment schema validation & MongoDB connection
    controllers/     # Request handlers (Articles, Reviews, Taxonomies, Auth, Media)
    middleware/      # Auth (RBAC), Rate Limiting, Centralized Error Handling, Zod Validation
    models/          # Mongoose Models (Article, Review, Game, Category, Tag, Author, Admin, Subscriber)
    routes/          # Express route definitions (/api/v1 and /api/v1/admin)
    services/        # Business logic (AuthService, Token handling, Lockout)
    utils/           # Structured Logger, API Response standardizer, Slugify
    app.ts           # Express application setup
    server.ts        # Server entry point & graceful shutdown
  scripts/
    bootstrapAdmin.ts # One-time secure admin bootstrap CLI
    seed.ts           # Safe development database seeder
  tests/
    api.test.ts      # Automated end-to-end integration and security test suite
  .env.example       # Template of environment variables
  package.json
  tsconfig.json
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Ensure MongoDB is running locally (`mongodb://127.0.0.1:27017/gamepulse`) or provide your cloud MongoDB Atlas URI.

### 3. Seed Development Database

To populate the database with complete editorial records (articles, games, reviews, authors, categories, tags):

```bash
npm run seed
```

> **Security Note**: The seed script is automatically blocked from running in `production` unless `ALLOW_PRODUCTION_SEED=true` is explicitly provided.

### 4. Bootstrap Initial Administrator

Initialize the first `super_admin` account using your secret bootstrap token:

```bash
npm run bootstrap-admin admin@gamepulse.io YourSecurePassword123! "Lead Editor" your_secure_bootstrap_token_here
```

The bootstrap routine will safely refuse execution if any administrator already exists in the database.

### 5. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5001`. Verify via health check:

```bash
curl http://localhost:5001/api/v1/health
```

### 6. Run Test Suite

```bash
npm test
```

Executes 23 automated integration, security, RBAC, draft privacy, and validation test cases.

## REST API Endpoints

### Public Endpoints (`/api/v1`)

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Server & database connectivity status |
| `GET` | `/sitemap.xml` | Published content XML sitemap |
| `GET` | `/articles` | Paginated articles list (supports category, tag, sort) |
| `GET` | `/articles/:slug` | Published article details (drafts return 404) |
| `GET` | `/articles/featured` | Featured lead stories |
| `GET` | `/articles/trending` | Trending ticker stories |
| `GET` | `/articles/popular` | High-traffic popular stories |
| `GET` | `/articles/related/:id` | Related articles based on taxonomy scoring |
| `GET` | `/categories` | Active category list |
| `GET` | `/categories/:slug` | Category details |
| `GET` | `/tags` | Editorial keyword tags |
| `GET` | `/games` | Video games database index |
| `GET` | `/games/:slug` | Game hub page entity |
| `GET` | `/reviews` | Published game reviews with scores |
| `GET` | `/reviews/:slug` | In-depth review breakdown |
| `GET` | `/authors` | Editorial staff profiles (sanitized) |
| `GET` | `/authors/:id` | Individual author profile |
| `GET` | `/search?q=...` | Safe public search |
| `POST` | `/newsletter/subscribe` | Double-opt-in subscriber registration |
| `GET` | `/newsletter/unsubscribe` | Secure token-hashed unsubscription |

### Admin Endpoints (`/api/v1/admin`)

*All admin endpoints require authentication via HttpOnly session cookie or `Authorization: Bearer <token>`.*

| Method | Endpoint | Required Role | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/login` | Public (Rate-limited) | Secure administrative sign-in |
| `POST` | `/auth/logout` | Authenticated | Clears session cookie |
| `GET` | `/auth/me` | Authenticated | Current user profile & role |
| `POST` | `/auth/bootstrap` | Token-protected | Initial administrator creation |
| `GET` | `/dashboard` | Authenticated | Publication metrics & overview |
| `GET` | `/articles` | Authenticated | Filterable article table (all statuses) |
| `POST` | `/articles` | Authenticated | Create draft (authors restricted to drafts) |
| `GET` | `/articles/:id` | Authenticated | Full article editor payload |
| `PATCH` | `/articles/:id` | Author (own) / Editor+ | Update article fields |
| `DELETE` | `/articles/:id` | Editor / Super Admin | Permanently delete article |
| `POST` | `/articles/:id/publish` | Editor / Super Admin | Publish article to live website |
| `POST` | `/articles/:id/archive` | Editor / Super Admin | Move article to archive |
| `GET/POST/PATCH/DELETE` | `/categories` | Super Admin (Editor read/edit) | Category taxonomy CRUD |
| `GET/POST/DELETE` | `/tags` | Editor / Super Admin | Tag taxonomy CRUD |
| `GET/POST/PATCH/DELETE` | `/games` | Super Admin (Editor read/edit) | Game database CRUD |
| `GET/POST/PATCH/DELETE` | `/reviews` | Super Admin (Editor read/edit) | Scored review CRUD |
| `GET/POST/PATCH/DELETE` | `/authors` | Super Admin (Editor read/edit) | Author profile CRUD |
| `GET/POST/PATCH/DELETE` | `/users` | Super Admin | Manage staff administrator accounts |
| `POST` | `/media/upload` | Authenticated | Upload image to Cloudinary CDN |

## Production Deployment & Operations

### Build Command

```bash
npm run build
```

Generates compiled JavaScript in `dist/`.

### Start Command

```bash
npm start
```

### Environment Variables Checklist

| Variable | Requirement | Description |
| --- | --- | --- |
| `NODE_ENV` | Required | Set to `production` |
| `PORT` | Required | Port to bind (e.g. 5001 or 8080) |
| `MONGODB_URI` | Required | Production MongoDB connection string |
| `FRONTEND_ORIGIN` | Required | Allowed frontend domain (e.g. `https://gamepulse.io`) |
| `JWT_SECRET` | Required | Cryptographically random string (min 32 characters) |
| `ADMIN_BOOTSTRAP_TOKEN` | Required | Secret token for initial setup |
| `SITE_URL` | Required | Production URL used in sitemap and canonical URLs |
| `CLOUDINARY_CLOUD_NAME` | Optional | Cloudinary cloud identifier |
| `CLOUDINARY_API_KEY` | Optional | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Optional | Cloudinary API secret |

### Database Backup & Restore

```bash
# Backup
mongodump --uri="mongodb://localhost:27017/gamepulse" --out=/backups/$(date +%F)

# Restore
mongorestore --uri="mongodb://localhost:27017/gamepulse" /backups/2026-10-14/gamepulse
```
