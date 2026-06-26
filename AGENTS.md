# Project Overview

Full-stack web application built with modern TypeScript tooling.

## Stack

- **Runtime:** Node.js 20+
- **Frontend:** React 19 + TypeScript 5.x
- **Backend:** Node.js + Express/Fastify
- **Database:** PostgreSQL via Drizzle ORM
- **Auth:** Clerk / JWT-based
- **Styling:** Tailwind CSS v4
- **Validation:** Zod
- **Testing:** Vitest (unit), Playwright (E2E)
- **Package manager:** pnpm (never npm or yarn)

## Hard Rules

- No secrets in code — use env vars via `.env` files (never commit)
- Validate all inputs at trust boundaries with Zod schemas
- Use TypeScript strict mode — no `any` types
- Error handling: every catch block must log or return a structured error response
- No speculative abstractions — one interface per implementation, one product per factory
- Database schema changes go through migrations, never raw SQL in app code
- All API routes must have authentication middleware unless explicitly public

## File Structure

```
src/
  app/         — API routes / pages
  components/  — UI components (shadcn/ui style)
  lib/         — shared utilities, db client, auth helpers
  schemas/     — Zod validation schemas
  types/       — shared TypeScript types
prisma/        — schema and migrations
tests/
  unit/
  e2e/
.env.example
```

## Conventions

- Commits: lowercase, one logical change per commit
- Component files: PascalCase. Utility files: camelCase
- Import order: React → external libs → internal aliases → types
- Functions under 20 lines — decompose if longer
- Comments explain WHY, not WHAT (delete obvious comments)
- Run `pnpm typecheck` and `pnpm lint` before every commit

## Common Tasks

**Add a page/route:** create file in `src/app/`, add route handler, add Zod validation, write test
**Add a DB table:** update `prisma/schema.prisma`, run migration, update types, update API routes
**Add auth:** add middleware in `src/lib/auth/`, protect routes, test with mock tokens
**Run tests:** `pnpm test` (unit), `pnpm test:e2e` (E2E)

## Context Pointers

- @opencode.json — MCP server config (Context7 for docs)
- `src/lib/README.md` — shared library patterns

## Deployment

- CI gates: typecheck → lint → test → build
- Required env vars: `DATABASE_URL`, `AUTH_SECRET`, `CONTEXT7_API_KEY`
- Push to main triggers deploy (auto or manual depending on setup)
