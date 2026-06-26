# FinTracker — Design Specification

## Overview
Cross-platform personal/family finance tracking app with multi-currency support, SMS/email auto-parsing, and paid subscriptions. Targets individuals and families. Built as a monorepo with shared types and validation.

## Tech Stack
- **Mobile:** React Native + Expo (TypeScript)
- **API:** Node.js + Express (TypeScript)
- **Database:** PostgreSQL via Drizzle ORM
- **Auth:** Clerk (email/password + Google/Apple OAuth)
- **Payments:** Revolut Business API ($10/mo recurring)
- **Validation:** Zod (shared between API and mobile)
- **SMS Parsing:** Android SMS Retriever API
- **Email Parsing:** Gmail API + node-cron polling
- **Testing:** Vitest (unit), Playwright (E2E)

## Architecture
### Monorepo Structure
```
fintracker/
  packages/
    mobile/       # React Native + Expo app
    api/          # Express backend
    shared/       # Zod schemas, types, utils
  docs/
    superpowers/
      specs/
```

### Data Flow
Mobile app <-> Express API <-> PostgreSQL
Mobile app -> Clerk SDK (auth)
API -> Revolut API (subscriptions)
Mobile -> SMS Retriever API (Android) / Gmail API (polling)

## Data Model

### Users & Teams
- `users`: id (uuid), clerk_id, email, display_name, currency_preference, tier (free/pro), created_at
- `families`: id (uuid), name, created_at
- `family_members`: user_id, family_id, role (admin/member)

### Accounts
- `accounts`: id (uuid), user_id (or family_id), name, type (cash/credit/debit/investment), currency, last_four (nullable, max 4 chars), balance (bigint cents), included_in_totals (boolean)

### Transactions
- `transactions`: id (uuid), account_id, amount (bigint cents, signed), currency, description, category_id, tags (text[]), date, is_parsed (boolean), source (manual/sms/gmail), raw_text (nullable, TTL 90 days), created_at
- `categories`: id (uuid), name, icon, color, type (expense/income/transfer), is_system (boolean)
- ~15 seed categories

### Subscriptions & Parsing Rules
- `subscriptions`: id (uuid), user_id, provider (revolut), status (active/cancelled/past_due), period_start, period_end, created_at
- `parsing_rules`: id (uuid), user_id, source (sms/gmail), sender_pattern, regex_pattern, account_id

### Schema Notes
All tables: uuid PKs, created_at/updated_at timestamps, soft deletes via deleted_at. RLS via user_id or family_id.

## API Routes
### Public
- `POST /api/auth/webhook` — Clerk webhook

### Authenticated
- `GET /api/accounts`, `POST /api/accounts`, `GET|PATCH|DELETE /api/accounts/:id`
- `GET /api/transactions` (paginated, filterable), `POST|PATCH|DELETE /api/transactions/:id`
- `GET /api/categories`, `POST /api/categories` (custom only)
- `GET /api/families`, `POST /api/families`, `PATCH /api/families/:id`, `POST /api/families/:id/members`
- `GET /api/subscription`
- `POST /api/parsing/import`, `GET|POST|DELETE /api/parsing/rules[/:id]`

## MVP Scope
1. Project scaffolding (monorepo, tsconfig, workspace config)
2. Database schema + Drizzle migrations (accounts, transactions, categories)
3. Clerk auth (webhook + mobile SDK)
4. API CRUD: accounts, transactions, categories
5. Mobile app: login, dashboard (balance + recent transactions), transaction list, add transaction form
6. Seed categories
7. Deployment: API to Fly.io/Railway, mobile EAS Build

## Future Phases
- Families/teams (pro)
- SMS/Gmail auto-parsing
- Multi-currency (display conversion)
- Budgeting (opt-in)
- Revolut subscription payments
- Charts and analytics
- CSV/PDF export
