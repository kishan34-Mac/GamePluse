# GAMEPULSE

GAMEPULSE is a React and TypeScript gaming-media frontend built with Vite. Its articles, reviews, games, authors, categories, and products are local editorial data; it has no backend, CMS, authentication, analytics, or message-delivery service.

## Local development

```bash
npm install
npm run dev
```

The development server prints the local address, normally `http://localhost:5173`.

## Quality checks

```bash
npm run lint
npm test
npm run build
```

`npm test` validates local content identifiers, slugs, references, supported routes, and the absence of placeholder affiliate destinations.

## Production configuration

Set these values in the deployment environment only when they are real, launched endpoints:

| Variable | Purpose |
| --- | --- |
| `VITE_SITE_URL` | Absolute production site URL used for canonical and structured-data URLs, for example `https://example.com`. |
| `VITE_CONTACT_EMAIL` | Review-code and general-contact mailbox. |
| `VITE_EDITORIAL_EMAIL` | Editorial mailbox. |
| `VITE_ADVERTISING_EMAIL` | Advertising mailbox. |

When `VITE_SITE_URL` is absent, the application intentionally omits canonicals and URL-dependent structured data rather than publishing an invented domain. `public/robots.txt` allows crawling, but no sitemap is published until a real production domain is configured. Advertising is not configured or displayed in this frontend.

## Vercel deployment

1. Import the repository into Vercel.
2. Select the project root as the repository root.
3. Keep the framework preset as Vite, with build command `npm run build` and output directory `dist`.
4. Add the verified environment values above in Vercel’s Production environment.
5. Deploy. `vercel.json` rewrites client-side routes to `index.html`, so direct visits and refreshes on nested routes resolve correctly.
6. After the domain is connected, set `VITE_SITE_URL` to that exact HTTPS origin and generate and submit a sitemap containing only the verified public routes.
