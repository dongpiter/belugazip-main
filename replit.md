# BELUGA Catering — Full-Stack Monorepo

## Overview

Premium catering company website for BELUGA (TP. Hồ Chí Minh, Vietnam) with a public-facing frontend, admin dashboard, and REST API backend.

## Architecture

### Monorepo Structure (pnpm workspaces)

```
workspace/
├── api-server/              # Express + Drizzle ORM backend
├── beluga-catering/         # React + Vite + Wouter frontend
├── packages/
│   ├── api-client-react/    # React Query hooks for API calls
│   ├── api-zod/             # Zod schemas (HealthCheckResponse)
│   └── db/                  # Drizzle ORM schema + DB connection
├── tsconfig.base.json       # Shared TypeScript config
└── pnpm-workspace.yaml      # Workspace + catalog definitions
```

### Ports
- **API Server**: port 8080 (external port 80)
- **Frontend**: port 22236 (external port 3000)

### Database
- PostgreSQL via `DATABASE_URL` env var
- Tables: menus, orders, leads, customers, blog_posts, site_settings, ab_tests, chat_sessions
- Auto-seeded on first startup (10 menus, 5 blog posts, 9 settings)

## Tech Stack

### Backend (`api-server`)
- Express 5 with TypeScript
- Drizzle ORM + PostgreSQL (pg)
- Pino logging
- Anthropic Claude AI integration
- Cookie-based admin auth

### Frontend (`beluga-catering`)
- React 19 + Vite 6
- Wouter for routing
- TanStack React Query for data fetching
- Tailwind CSS v4 + shadcn/ui components
- Framer Motion animations
- TipTap rich text editor (v3)
- Recharts for analytics

### Shared Packages
- `@workspace/api-client-react` — all React Query hooks
- `@workspace/db` — Drizzle schema + db connection
- `@workspace/api-zod` — Zod validation schemas

## Key Features

### Public Pages
- Home with hero, services, featured menus, testimonials
- Menu listing with category filters
- Menu detail with booking form
- Blog listing + individual post pages
- About, Contact pages
- AI chat widget

### Admin Dashboard (`/admin`)
- Login (password: `beluga2025`)
- Dashboard with analytics charts
- Menu management (CRUD) with TipTap rich text + live preview
- Blog management (CRUD) with TipTap + live preview + AI generation
- Orders management with status updates + AI quote emails
- Leads & Customers tables
- Analytics (revenue chart, leads by source, top menus)
- Site settings editor
- A/B test tracking
- AI weekly insights

## Admin Forms

### Menu Form (`/admin/menu/new` or `/admin/menu/:id`)
- 60/40 split layout: form left, live preview card right
- TipTap editor for `long_description`
- Dishes list editor, FAQ editor
- Nutrition info fields
- SEO metadata fields

### Blog Form (`/admin/blog/new` or `/admin/blog/:id`)
- 60/40 split layout: form left, live preview right
- TipTap editor for `content` and `excerpt`
- AI blog generation via Anthropic
- Google SERP preview
- Reading time estimation

## API Endpoints

- `GET /api/menus` — public menu list
- `GET/POST /api/admin/menus` — admin menu management
- `PUT/DELETE /api/admin/menus/:id`
- `GET /api/blog` — public blog posts
- `GET/POST /api/admin/blog` — admin blog management
- `GET /api/orders` — order list
- `POST /api/orders` — create order (AI scoring)
- `PATCH /api/orders/:id/status`
- `GET /api/leads`
- `GET /api/customers`
- `GET /api/analytics/summary`
- `GET /api/analytics/revenue`
- `GET /api/analytics/leads-by-source`
- `GET /api/analytics/top-menus`
- `GET/PUT /api/settings`
- `PUT /api/admin/settings/:key`
- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET /api/admin/check`
- `POST /api/ai/recommend-menu`
- `POST /api/ai/chat`
- `POST /api/ai/generate-blog`
- `POST /api/ai/generate-quote-email`
- `GET /api/ai/weekly-insight`
- `GET /api/healthz`

## Development

```bash
# Install dependencies
pnpm install

# Run all workflows via Replit UI, or manually:
pnpm --filter @workspace/api-server run dev      # API on :8080
pnpm --filter @workspace/beluga-catering run dev  # Frontend on :22236
```

## Environment Variables
- `DATABASE_URL` — PostgreSQL connection string
- `ANTHROPIC_API_KEY` — for AI features
- `ADMIN_PASSWORD` — admin login (default: `beluga2025`)
- `SESSION_SECRET` — cookie signing secret
- `PORT` — set automatically per workflow
