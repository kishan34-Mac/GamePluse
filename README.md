# GAMEPULSE — Full-Stack Gaming Media Publication & CMS

GAMEPULSE is a high-performance gaming journalism and digital media platform featuring a modern React frontend, dedicated Node.js/Express REST API, MongoDB database architecture, and an editorial Content Management System (CMS).

## Architecture

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide icons, React Router v7.
- **Backend**: Node.js, Express, TypeScript, MongoDB, Mongoose, Zod validation, Bcrypt password hashing, Helmet security, rate limiting.
- **CMS**: Dedicated administrative interface mounted at `/admin` with role-based access control (Super Admin, Editor, Author), draft privacy protection, SEO metadata controls, and live preview.
- **Media**: Integrated Cloudinary CDN upload support for production assets.

---

## Quick Start

### 1. Prerequisites

- **Node.js**: >= 20.x (tested on v26.7.0)
- **MongoDB**: v7+ or v8+ running locally or cloud MongoDB Atlas instance

### 2. Install Dependencies

```bash
# Frontend
npm install

# Backend
npm --prefix backend install
```

### 3. Setup Environment Variables

```bash
# Backend configuration
cp backend/.env.example backend/.env
```

Review `backend/.env` to confirm `MONGODB_URI` (`mongodb://127.0.0.1:27017/gamepulse`) and security tokens.

### 4. Initialize Database & First Administrator

```bash
# Populate MongoDB with editorial articles, games, reviews, categories, and tags
npm run backend:seed

# Create initial super administrator
npm run backend:bootstrap admin@gamepulse.io YourSecurePassword123! "Lead Editor" your_secure_bootstrap_token_here
```

### 5. Start Development Servers

In terminal 1 (Backend):
```bash
npm run backend:dev
```
Backend runs at `http://localhost:5001`. Health check available at `http://localhost:5001/api/v1/health`.

In terminal 2 (Frontend):
```bash
npm run dev
```
Frontend runs at `http://localhost:5173`. Access the Editorial CMS at `http://localhost:5173/admin`.

---

## Quality & Test Commands

```bash
# Run all tests (frontend integrity + backend integration)
npm run test:all

# Run frontend tests only
npm test

# Run backend tests only (23 test cases covering auth, RBAC, drafts, and endpoints)
npm run backend:test

# Lint codebase
npm run lint

# Build frontend and backend for production
npm run build
npm run backend:build
```

---

## Environment Variables Reference

### Frontend Variables

| Variable | Description |
| --- | --- |
| `VITE_API_BASE_URL` | Public backend API URL (defaults to `http://localhost:5001/api/v1`) |
| `VITE_SITE_URL` | Verified production canonical origin (e.g. `https://gamepulse.io`) |
| `VITE_USE_LOCAL_MOCK` | Optional flag (`true`/`false`) to force offline demo data |

### Backend Variables

| Variable | Description |
| --- | --- |
| `NODE_ENV` | `development`, `production`, or `test` |
| `PORT` | HTTP port (default `5001`) |
| `MONGODB_URI` | MongoDB connection string |
| `FRONTEND_ORIGIN` | Allowed CORS origin (e.g. `http://localhost:5173`) |
| `JWT_SECRET` | Secret key for signing admin authentication tokens (minimum 32 characters in production) |
| `ADMIN_BOOTSTRAP_TOKEN` | Protected secret required for initial super administrator bootstrapping |
| `SITE_URL` | Verified public domain used for XML sitemap generation |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud identifier (optional in development) |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

---

## Deployment Guide

### Vercel (Frontend)

1. Connect the Git repository to Vercel.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Environment Variables:
   - `VITE_API_BASE_URL`: URL of your deployed backend (e.g. `https://api.gamepulse.io/api/v1`).
   - `VITE_SITE_URL`: `https://gamepulse.io`.
6. `vercel.json` automatically rewrites nested SPA routes to `index.html`.

### Node.js / Docker / Cloud Run / VPS (Backend)

1. Deploy the `backend/` directory to your Node.js hosting platform.
2. Build command: `npm run build`.
3. Start command: `npm start`.
4. Ensure MongoDB connection string and environment variables are configured.
5. Set `FRONTEND_ORIGIN` to your verified frontend domain.
6. Verify deployment via `GET /api/v1/health`.
