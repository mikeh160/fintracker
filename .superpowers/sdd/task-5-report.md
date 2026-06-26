# Task 5 Report: API CRUD Routes — Accounts, Transactions, Categories

**Status:** DONE

## What was implemented
REST CRUD endpoints for accounts, transactions, and categories, all behind `requireAuth` middleware. Index.ts updated to mount all three route modules.

## Files created
- packages/api/src/routes/accounts.ts — GET /, POST /, GET /:id, PATCH /:id, DELETE /:id
- packages/api/src/routes/transactions.ts — GET / (paginated), POST /, GET /:id, PATCH /:id, DELETE /:id
- packages/api/src/routes/categories.ts — GET / (includes system categories with null clerkUserId), POST /

## Files modified
- packages/api/src/index.ts — import and mount accountRoutes, transactionRoutes, categoryRoutes under /api/accounts, /api/transactions, /api/categories

## Notable fixes from brief
1. `req.params.id!` — required because `noUncheckedIndexedAccess` is on in tsconfig.base.json, making indexed access return `string | undefined`
2. `const { date, ...rest } = parsed; ...date: new Date(date)` — Zod parses `date` as a string, but Drizzle column expects `Date`
3. `const router: Router = Router()` and `const app: Express = express()` — explicit type annotations needed to avoid TS2742 cross-package portability errors
4. Template literal `console.log(`api listening on port ${env.PORT}`)` — needed single-quoted PS here-string to avoid backtick mangling

## Typecheck result
`pnpm --filter @fintracker/api typecheck` — no errors

## Commit
71eb2e2 - feat: add accounts, transactions, categories CRUD routes
(5 files, 183 insertions)