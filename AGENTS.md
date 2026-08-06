# bike-polo

Scoreboard & referee app for bike polo tournaments.

## Quick start

```bash
cp sample.env .env      # fill in DATABASE_URL + BETTER_AUTH_SECRET
docker compose up -d    # start local PostgreSQL
npx drizzle-kit migrate # apply schema
yarn dev                # or: npm run dev
```

## Commands

| Command | Tool |
|---------|------|
| `yarn dev` | Next.js 15 dev with Turbopack |
| `yarn build` | Production build |
| `yarn lint` | ESLint (flat config, `react-hooks/exhaustive-deps` off) |
| `npx drizzle-kit generate` | Generate migration from schema changes |
| `npx drizzle-kit migrate` | Apply pending migrations |
| `docker compose up -d` | Local PostgreSQL |

## Stack

- **Next.js 15** App Router — route groups `(public)` / `(protected)`
- **Drizzle ORM** — PostgreSQL, `snake_case` casing, schema in `src/db/schema/`
- **Better Auth** — email/password; server in `src/lib/auth.ts`, client in `src/lib/auth-client.ts`
- **shadcn/ui** — New York style, Lucide icons (config in `components.json`)
- **Tailwind CSS** v3, `tailwindcss-animate`
- **Yarn v1** (classic) — but Vercel deploys run `npm run build && npx drizzle-kit migrate`
- **Path alias** `@/*` → `./src/*`

## Architecture

- DB connection: `src/db/index.ts` — switches between `neon-http` (production) and `node-postgres` (dev) based on `NODE_ENV`
- Repository pattern in `src/db/repositories/` — files use `"use server"` at top level
- Auth tables mirror Better Auth's Drizzle adapter schema in `src/db/schema/auth.ts`
- Business schema in `src/db/schema/business.ts`: `tournament` → `ground` (1:N), ground has timer + score state
- Timer status enum values: `initialed` (typo intentional), `started`, `paused`
- Routes centralized in `src/routes.ts`
- Server actions are defined inline in page components (not in separate files)

## Deploy

Vercel — build command: `npm run build && npx drizzle-kit migrate`

## Gotchas

- `.env` is gitignored (`sample.env` has the keys)
- No test framework installed
- `timer_offset` column is `real` (float)
- Custom monospace fonts: `Lightdot`, `Scoreboard`
