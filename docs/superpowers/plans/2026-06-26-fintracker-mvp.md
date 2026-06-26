# FinTracker MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a working MVP of a cross-platform finance tracking app with account management, transaction logging, and category organization.

**Architecture:** Monorepo with three packages — `shared` (Zod schemas + types), `api` (Express + Drizzle ORM + PostgreSQL), `mobile` (React Native + Expo + Clerk). API serves REST endpoints consumed by the mobile app. Auth handled by Clerk (webhook + SDK).

**Tech Stack:** TypeScript 5.x, Node.js 20+, Express, Drizzle ORM, PostgreSQL, Clerk, React Native + Expo, Zod, pnpm workspaces.

## Global Constraints
- TypeScript strict mode — no `any` types
- All input validation at trust boundaries using Zod
- No secrets in code — use `.env` files
- Functions under 20 lines
- Import order: React → external libs → internal aliases → types
- No speculative abstractions (ponytail: YAGNI)
- pnpm only — never npm or yarn
- UUID primary keys for all DB tables
- All tables have created_at/updated_at timestamps

---
### Task 1: Monorepo Scaffolding

**Files:**
- Create: `root/package.json`
- Create: `root/tsconfig.base.json`
- Create: `root/.env.example`
- Create: `root/.gitignore`
- Create: `packages/shared/package.json`
- Create: `packages/shared/tsconfig.json`
- Create: `packages/api/package.json`
- Create: `packages/api/tsconfig.json`
- Create: `packages/mobile/package.json`

**Interfaces:**
- Consumes: nothing (first task)
- Produces: workspace root with pnpm workspaces, three package skeletons

- [ ] **Step 1: Create root package.json**

```json
{
  "name": "fintracker",
  "private": true,
  "scripts": {
    "dev": "pnpm --filter @fintracker/api dev",
    "typecheck": "pnpm -r typecheck",
    "lint": "pnpm -r lint"
  }
}
```

- [ ] **Step 2: Create pnpm-workspace.yaml**

```yaml
packages:
  - "packages/*"
```

- [ ] **Step 3: Create tsconfig.base.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist",
    "rootDir": "src",
    "esModuleInterop": true
  }
}
```

- [ ] **Step 4: Create .env.example**

```
DATABASE_URL=postgres://user:password@localhost:5432/fintracker
CLERK_SECRET_KEY=sk_test_xxx
CLERK_PUBLISHABLE_KEY=pk_test_xxx
PORT=3001
```

- [ ] **Step 5: Create .gitignore**

```
node_modules/
dist/
.env
*.tsbuildinfo
.expo/
```

- [ ] **Step 6: Create packages/shared/package.json**

```json
{
  "name": "@fintracker/shared",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0"
  }
}
```

- [ ] **Step 7: Create packages/shared/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

- [ ] **Step 8: Create packages/api/package.json**

```json
{
  "name": "@fintracker/api",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "start": "node dist/index.js",
    "build": "tsc",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@clerk/backend": "^1.0.0",
    "@fintracker/shared": "workspace:*",
    "@libsql/client": "^0.14.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.0",
    "drizzle-orm": "^0.33.0",
    "express": "^4.21.0",
    "postgres": "^3.4.0",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/node": "^20.14.0",
    "drizzle-kit": "^0.24.0",
    "tsx": "^4.16.0",
    "typescript": "^5.5.0",
    "vitest": "^1.6.0"
  }
}
```

- [ ] **Step 9: Create packages/api/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "types": ["node"]
  },
  "include": ["src"]
}
```

- [ ] **Step 10: Create packages/mobile/package.json**

```json
{
  "name": "@fintracker/mobile",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@clerk/clerk-expo": "^2.0.0",
    "@fintracker/shared": "workspace:*",
    "expo": "~52.0.0",
    "expo-secure-store": "~14.0.0",
    "expo-status-bar": "~2.0.0",
    "react": "18.3.1",
    "react-native": "0.76.0",
    "react-native-safe-area-context": "4.12.0",
    "expo-router": "~4.0.0",
    "expo-linking": "~7.0.0",
    "react-native-gesture-handler": "~2.20.0",
    "react-native-reanimated": "~3.16.0"
  },
  "devDependencies": {
    "@types/react": "~18.3.0",
    "typescript": "^5.5.0"
  }
}
```

- [ ] **Step 11: Initialize pnpm and install**

Run: `pnpm install`
Expected: node_modules created, workspace linked

- [ ] **Step 12: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold monorepo with shared, api, mobile packages"
```
### Task 2: Shared Zod Schemas and Types

**Files:**
- Create: `packages/shared/src/index.ts`
- Create: `packages/shared/src/schemas/account.ts`
- Create: `packages/shared/src/schemas/transaction.ts`
- Create: `packages/shared/src/schemas/category.ts`
- Create: `packages/shared/src/types/index.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `AccountSchema`, `TransactionSchema`, `CategorySchema` (Zod schemas) and `Account`, `Transaction`, `Category` (TS types) — used by both API and mobile

- [ ] **Step 1: Create schemas/account.ts**

```typescript
import { z } from "zod";

export const AccountTypeEnum = z.enum(["cash", "credit", "debit", "investment"]);
export const CurrencyEnum = z.enum(["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "INR", "BRL"]);

export const AccountSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  type: AccountTypeEnum,
  currency: CurrencyEnum,
  balance: z.number().int(),
  lastFour: z.string().length(4).nullable().optional(),
  includedInTotals: z.boolean().default(true),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateAccountSchema = AccountSchema.omit({
  id: true, createdAt: true, updatedAt: true,
});

export const UpdateAccountSchema = CreateAccountSchema.partial();
```

- [ ] **Step 2: Create schemas/category.ts**

```typescript
import { z } from "zod";

export const CategoryTypeEnum = z.enum(["expense", "income", "transfer"]);

export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(50),
  icon: z.string().max(50).default("tag"),
  color: z.string().max(7).default("#6366f1"),
  type: CategoryTypeEnum,
  isSystem: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateCategorySchema = CategorySchema.omit({
  id: true, isSystem: true, createdAt: true, updatedAt: true,
});
```

- [ ] **Step 3: Create schemas/transaction.ts**

```typescript
import { z } from "zod";

export const TransactionSourceEnum = z.enum(["manual", "sms", "gmail"]);

export const TransactionSchema = z.object({
  id: z.string().uuid(),
  accountId: z.string().uuid(),
  amount: z.number().int(),
  currency: z.string().length(3),
  description: z.string().max(500).default(""),
  categoryId: z.string().uuid().nullable().optional(),
  tags: z.array(z.string().max(50)).default([]),
  date: z.string().datetime(),
  isParsed: z.boolean().default(false),
  source: TransactionSourceEnum.default("manual"),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateTransactionSchema = TransactionSchema.omit({
  id: true, isParsed: true, createdAt: true, updatedAt: true,
});

export const UpdateTransactionSchema = CreateTransactionSchema.partial();
```

- [ ] **Step 4: Create types/index.ts**

```typescript
import { z } from "zod";
import {
  AccountSchema, CreateAccountSchema, UpdateAccountSchema,
} from "../schemas/account.js";
import {
  CategorySchema, CreateCategorySchema,
} from "../schemas/category.js";
import {
  TransactionSchema, CreateTransactionSchema, UpdateTransactionSchema,
} from "../schemas/transaction.js";

export type Account = z.infer<typeof AccountSchema>;
export type CreateAccount = z.infer<typeof CreateAccountSchema>;
export type UpdateAccount = z.infer<typeof UpdateAccountSchema>;

export type Category = z.infer<typeof CategorySchema>;
export type CreateCategory = z.infer<typeof CreateCategorySchema>;

export type Transaction = z.infer<typeof TransactionSchema>;
export type CreateTransaction = z.infer<typeof CreateTransactionSchema>;
export type UpdateTransaction = z.infer<typeof UpdateTransactionSchema>;
```

- [ ] **Step 5: Create src/index.ts (barrel export)**

```typescript
export * from "./schemas/account.js";
export * from "./schemas/category.js";
export * from "./schemas/transaction.js";
export * from "./types/index.js";
```

- [ ] **Step 6: Run typecheck**

Run: `pnpm --filter @fintracker/shared typecheck`
Expected: no errors

- [ ] **Step 7: Commit**

```bash
git add packages/shared/
git commit -m "feat: add shared zod schemas and types"
```
### Task 3: Database Schema + Drizzle Setup

**Files:**
- Create: `packages/api/src/db/schema.ts`
- Create: `packages/api/src/db/index.ts`
- Create: `packages/api/src/db/seed.ts`
- Create: `packages/api/drizzle.config.ts`
- Create: `packages/api/src/env.ts`
- Add: `packages/api/.env`

**Interfaces:**
- Consumes: shared types from Task 2
- Produces: `db` (Drizzle client), `schema` object with all table definitions, `seed()` function

- [ ] **Step 1: Create env.ts**

```typescript
import "dotenv/config";

export const env = {
  DATABASE_URL: process.env.DATABASE_URL ?? "postgres://localhost:5432/fintracker",
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ?? "",
  PORT: parseInt(process.env.PORT ?? "3001", 10),
};
```

- [ ] **Step 2: Create drizzle.config.ts**

```typescript
import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
} satisfies Config;
```

- [ ] **Step 3: Create db/schema.ts**

```typescript
import { pgTable, uuid, text, bigint, boolean, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

export const accountTypeEnum = pgEnum("account_type", ["cash", "credit", "debit", "investment"]);

export const accounts = pgTable("accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: text("clerk_user_id").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  type: accountTypeEnum("type").notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("USD"),
  balance: bigint("balance", { mode: "number" }).notNull().default(0),
  lastFour: varchar("last_four", { length: 4 }),
  includedInTotals: boolean("included_in_totals").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: text("clerk_user_id"),
  name: varchar("name", { length: 50 }).notNull(),
  icon: varchar("icon", { length: 50 }).notNull().default("tag"),
  color: varchar("color", { length: 7 }).notNull().default("#6366f1"),
  type: text("type", { enum: ["expense", "income", "transfer"] }).notNull(),
  isSystem: boolean("is_system").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  accountId: uuid("account_id").notNull().references(() => accounts.id),
  clerkUserId: text("clerk_user_id").notNull(),
  amount: bigint("amount", { mode: "number" }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("USD"),
  description: text("description").notNull().default(""),
  categoryId: uuid("category_id").references(() => categories.id),
  tags: text("tags").array().notNull().default([]),
  date: timestamp("date").notNull().defaultNow(),
  isParsed: boolean("is_parsed").notNull().default(false),
  source: text("source", { enum: ["manual", "sms", "gmail"] }).notNull().default("manual"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});
```

- [ ] **Step 4: Create db/index.ts**

```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../env.js";
import * as schema from "./schema.js";

const client = postgres(env.DATABASE_URL);
export const db = drizzle(client, { schema });
export type DB = typeof db;
```

- [ ] **Step 5: Create db/seed.ts**

```typescript
import { db } from "./index.js";
import { categories } from "./schema.js";

const defaultCategories = [
  { name: "Salary", icon: "wallet", color: "#22c55e", type: "income" as const, isSystem: true },
  { name: "Freelance", icon: "briefcase", color: "#16a34a", type: "income" as const, isSystem: true },
  { name: "Groceries", icon: "shopping-cart", color: "#ef4444", type: "expense" as const, isSystem: true },
  { name: "Rent", icon: "home", color: "#f97316", type: "expense" as const, isSystem: true },
  { name: "Utilities", icon: "zap", color: "#eab308", type: "expense" as const, isSystem: true },
  { name: "Dining", icon: "utensils", color: "#ec4899", type: "expense" as const, isSystem: true },
  { name: "Transport", icon: "car", color: "#8b5cf6", type: "expense" as const, isSystem: true },
  { name: "Shopping", icon: "shopping-bag", color: "#06b6d4", type: "expense" as const, isSystem: true },
  { name: "Healthcare", icon: "heart", color: "#f43f5e", type: "expense" as const, isSystem: true },
  { name: "Entertainment", icon: "film", color: "#d946ef", type: "expense" as const, isSystem: true },
  { name: "Education", icon: "book", color: "#6366f1", type: "expense" as const, isSystem: true },
  { name: "Insurance", icon: "shield", color: "#14b8a6", type: "expense" as const, isSystem: true },
  { name: "Transfer", icon: "arrow-left-right", color: "#78716c", type: "transfer" as const, isSystem: true },
  { name: "Other Income", icon: "plus", color: "#22c55e", type: "income" as const, isSystem: true },
  { name: "Other Expense", icon: "minus", color: "#ef4444", type: "expense" as const, isSystem: true },
];

export async function seed(clerkUserId?: string) {
  for (const cat of defaultCategories) {
    await db.insert(categories).values({ ...cat, clerkUserId }).onConflictDoNothing();
  }
}
```

- [ ] **Step 6: Generate and run migrations**

Run: `pnpm --filter @fintracker/api exec drizzle-kit generate`
Run: `pnpm --filter @fintracker/api exec drizzle-kit migrate`
Expected: drizzle/ directory created with SQL migration files

- [ ] **Step 7: Run typecheck**

Run: `pnpm --filter @fintracker/api typecheck`
Expected: no errors

- [ ] **Step 8: Commit**

```bash
git add packages/api/
git commit -m "feat: add drizzle schema, db client, and seed data"
```
### Task 4: Auth — Clerk Webhook + API Middleware

**Files:**
- Create: `packages/api/src/middleware/auth.ts`
- Create: `packages/api/src/routes/auth.ts`
- Modify: `packages/api/src/index.ts`
- Create: `packages/api/src/index.ts`

**Interfaces:**
- Consumes: `env` from Task 3, `db` from Task 3
- Produces: `requireAuth` middleware (Express), webhook route that creates/deletes users in DB

- [ ] **Step 1: Create middleware/auth.ts**

```typescript
import { createClerkClient } from "@clerk/backend";
import type { Request, Response, NextFunction } from "express";
import { env } from "../env.js";

export const clerkClient = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });

export interface AuthRequest extends Request {
  userId?: string;
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "missing authorization header" });
  }
  try {
    const token = authHeader.slice(7);
    const session = await clerkClient.sessions.verifySession(token, { client: "mobile" } as any);
    // ponytail: casts client for verifySession types — session token contains userId
    req.userId = session.userId;
    next();
  } catch {
    return res.status(401).json({ error: "invalid token" });
  }
}
```

- [ ] **Step 2: Create routes/auth.ts**

```typescript
import { Router } from "express";
import type { Request, Response } from "express";
import { Webhook } from "svix";

const router = Router();
const webhookSecret = process.env.CLERK_WEBHOOK_SECRET ?? "";

router.post("/webhook", async (req: Request, res: Response) => {
  const svixId = req.headers["svix-id"] as string;
  const svixTimestamp = req.headers["svix-timestamp"] as string;
  const svixSignature = req.headers["svix-signature"] as string;

  if (!svixId || !svixTimestamp || !svixSignature) {
    return res.status(400).json({ error: "missing svix headers" });
  }

  try {
    const wh = new Webhook(webhookSecret);
    const payload = wh.verify(JSON.stringify(req.body), {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as any;

    if (payload.type === "user.created") {
      // Optionally insert user record — for now we just acknowledge
      console.log("user.created:", payload.data.id);
    }
    if (payload.type === "user.deleted") {
      console.log("user.deleted:", payload.data.id);
    }

    return res.json({ success: true });
  } catch {
    return res.status(400).json({ error: "invalid webhook signature" });
  }
});

export default router;
```

- [ ] **Step 3: Update packages/api/package.json to add svix dependency**

Add `"svix": "^1.30.0"` to dependencies in `packages/api/package.json`.

- [ ] **Step 4: Create src/index.ts (API entry point)**

```typescript
import "dotenv/config";
import express from "express";
import cors from "cors";
import { env } from "./env.js";
import authRoutes from "./routes/auth.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(env.PORT, () => {
  console.log(`api listening on port ${env.PORT}`);
});

export default app;
```

- [ ] **Step 5: Run pnpm install**

Run: `pnpm install`
Expected: svix installed

- [ ] **Step 6: Run typecheck**

Run: `pnpm --filter @fintracker/api typecheck`
Expected: no errors

- [ ] **Step 7: Commit**

```bash
git add packages/api/
git commit -m "feat: add auth middleware and clerk webhook"
```
### Task 5: API Routes — Accounts, Transactions, Categories CRUD

**Files:**
- Create: `packages/api/src/routes/accounts.ts`
- Create: `packages/api/src/routes/transactions.ts`
- Create: `packages/api/src/routes/categories.ts`
- Modify: `packages/api/src/index.ts`

**Interfaces:**
- Consumes: `db`, `requireAuth`, `AuthRequest` from Tasks 3-4, shared schemas from Task 2
- Produces: REST endpoints for account, transaction, category CRUD

- [ ] **Step 1: Create routes/accounts.ts**

```typescript
import { Router } from "express";
import { eq, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { accounts } from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";
import type { AuthRequest } from "../middleware/auth.js";
import { CreateAccountSchema } from "@fintracker/shared";

const router = Router();
router.use(requireAuth);

router.get("/", async (req: AuthRequest, res) => {
  const rows = await db.select().from(accounts).where(eq(accounts.clerkUserId, req.userId!));
  res.json(rows);
});

router.post("/", async (req: AuthRequest, res) => {
  const parsed = CreateAccountSchema.parse(req.body);
  const [row] = await db.insert(accounts).values({ ...parsed, clerkUserId: req.userId! }).returning();
  res.status(201).json(row);
});

router.get("/:id", async (req: AuthRequest, res) => {
  const [row] = await db.select().from(accounts).where(
    and(eq(accounts.id, req.params.id), eq(accounts.clerkUserId, req.userId!)),
  );
  if (!row) return res.status(404).json({ error: "not found" });
  res.json(row);
});

router.patch("/:id", async (req: AuthRequest, res) => {
  const [row] = await db.update(accounts).set(req.body).where(
    and(eq(accounts.id, req.params.id), eq(accounts.clerkUserId, req.userId!)),
  ).returning();
  if (!row) return res.status(404).json({ error: "not found" });
  res.json(row);
});

router.delete("/:id", async (req: AuthRequest, res) => {
  const [row] = await db.delete(accounts).where(
    and(eq(accounts.id, req.params.id), eq(accounts.clerkUserId, req.userId!)),
  ).returning();
  if (!row) return res.status(404).json({ error: "not found" });
  res.json({ deleted: true });
});

export default router;
```

- [ ] **Step 2: Create routes/transactions.ts**

```typescript
import { Router } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db } from "../db/index.js";
import { transactions } from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";
import type { AuthRequest } from "../middleware/auth.js";
import { CreateTransactionSchema } from "@fintracker/shared";

const router = Router();
router.use(requireAuth);

router.get("/", async (req: AuthRequest, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = (page - 1) * limit;
  const rows = await db.select().from(transactions)
    .where(eq(transactions.clerkUserId, req.userId!))
    .orderBy(desc(transactions.date))
    .limit(limit).offset(offset);
  res.json(rows);
});

router.post("/", async (req: AuthRequest, res) => {
  const parsed = CreateTransactionSchema.parse(req.body);
  const [row] = await db.insert(transactions).values({ ...parsed, clerkUserId: req.userId! }).returning();
  res.status(201).json(row);
});

router.get("/:id", async (req: AuthRequest, res) => {
  const [row] = await db.select().from(transactions).where(
    and(eq(transactions.id, req.params.id), eq(transactions.clerkUserId, req.userId!)),
  );
  if (!row) return res.status(404).json({ error: "not found" });
  res.json(row);
});

router.patch("/:id", async (req: AuthRequest, res) => {
  const [row] = await db.update(transactions).set(req.body).where(
    and(eq(transactions.id, req.params.id), eq(transactions.clerkUserId, req.userId!)),
  ).returning();
  if (!row) return res.status(404).json({ error: "not found" });
  res.json(row);
});

router.delete("/:id", async (req: AuthRequest, res) => {
  const [row] = await db.delete(transactions).where(
    and(eq(transactions.id, req.params.id), eq(transactions.clerkUserId, req.userId!)),
  ).returning();
  if (!row) return res.status(404).json({ error: "not found" });
  res.json({ deleted: true });
});

export default router;
```

- [ ] **Step 3: Create routes/categories.ts**

```typescript
import { Router } from "express";
import { eq, or, isNull } from "drizzle-orm";
import { db } from "../db/index.js";
import { categories } from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";
import type { AuthRequest } from "../middleware/auth.js";
import { CreateCategorySchema } from "@fintracker/shared";

const router = Router();
router.use(requireAuth);

router.get("/", async (req: AuthRequest, res) => {
  const rows = await db.select().from(categories).where(
    or(eq(categories.clerkUserId, req.userId!), isNull(categories.clerkUserId)),
  );
  res.json(rows);
});

router.post("/", async (req: AuthRequest, res) => {
  const parsed = CreateCategorySchema.parse(req.body);
  const [row] = await db.insert(categories).values({ ...parsed, clerkUserId: req.userId! }).returning();
  res.status(201).json(row);
});

export default router;
```

- [ ] **Step 4: Update src/index.ts**

```typescript
import "dotenv/config";
import express from "express";
import cors from "cors";
import { env } from "./env.js";
import authRoutes from "./routes/auth.js";
import accountRoutes from "./routes/accounts.js";
import transactionRoutes from "./routes/transactions.js";
import categoryRoutes from "./routes/categories.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.listen(env.PORT, () => console.log(`api listening on port ${env.PORT}`));
export default app;
```

- [ ] **Step 5: Run typecheck**

Run: `pnpm --filter @fintracker/api typecheck`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add packages/api/src/
git commit -m "feat: add accounts, transactions, categories CRUD routes"
```
### Task 6: Mobile App — Expo + Clerk + Basic Screens

**Files:**
- Create: `packages/mobile/app.json`
- Create: `packages/mobile/app/_layout.tsx`
- Create: `packages/mobile/app/index.tsx`
- Create: `packages/mobile/app/(tabs)/_layout.tsx`
- Create: `packages/mobile/app/(tabs)/index.tsx` (dashboard)
- Create: `packages/mobile/app/(tabs)/transactions.tsx`
- Create: `packages/mobile/app/(tabs)/add.tsx`
- Create: `packages/mobile/src/api/client.ts`
- Create: `packages/mobile/tsconfig.json`

**Interfaces:**
- Consumes: API routes from Task 5, shared types from Task 2
- Produces: Mobile app with login, dashboard, transaction list, add transaction

- [ ] **Step 1: Create app.json**

```json
{
  "expo": {
    "name": "FinTracker",
    "slug": "fintracker",
    "scheme": "fintracker",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": { "backgroundColor": "#ffffff" },
    "ios": { "supportsTablet": true, "bundleIdentifier": "com.fintracker.app" },
    "android": { "package": "com.fintracker.app" },
    "plugins": [ "expo-router", "expo-secure-store" ]
  }
}
```
- [ ] **Step 2: Create tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "strict": true,
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

- [ ] **Step 3: Create src/api/token-cache.ts**

```typescript
import * as SecureStore from "expo-secure-store";
import type { TokenCache } from "@clerk/clerk-expo/dist/cache";

export const tokenCache: TokenCache = {
  async getToken(key: string) { return SecureStore.getItemAsync(key); },
  async saveToken(key: string, value: string) { return SecureStore.setItemAsync(key, value); },
  async deleteToken(key: string) { return SecureStore.deleteItemAsync(key); },
};
```

- [ ] **Step 4: Create src/api/client.ts**

```typescript
import { getToken } from "@clerk/clerk-expo";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001";

async function authFetch(path: string, options: RequestInit = {}) {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  getAccounts: () => authFetch("/api/accounts"),
  createAccount: (data: any) => authFetch("/api/accounts", { method: "POST", body: JSON.stringify(data) }),
  getTransactions: (page = 1) => authFetch(`/api/transactions?page=${page}&limit=50`),
  createTransaction: (data: any) => authFetch("/api/transactions", { method: "POST", body: JSON.stringify(data) }),
  getCategories: () => authFetch("/api/categories"),
};
```
- [ ] **Step 5: Create app/_layout.tsx (root with ClerkProvider)**

```tsx
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { tokenCache } from "../src/api/token-cache";
import { Stack } from "expo-router";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <SignedIn>
        <Stack screenOptions={{ headerShown: false }} />
      </SignedIn>
      <SignedOut>
        <Stack screenOptions={{ headerShown: false }} />
      </SignedOut>
    </ClerkProvider>
  );
}
```

- [ ] **Step 6: Create app/index.tsx (auth screen)**

```tsx
import { useOAuth, useSignIn, useSignUp } from "@clerk/clerk-expo";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { router } from "expo-router";

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, setActive: setActiveSignIn } = useSignIn();
  const { signUp, setActive: setActiveSignUp } = useSignUp();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  async function handleSubmit() {
    try {
      if (isSignUp) {
        const result = await signUp!.create({ emailAddress: email, password });
        await setActiveSignUp!({ session: result.createdSessionId });
      } else {
        const result = await signIn!.create({ identifier: email, password });
        await setActiveSignIn!({ session: result.createdSessionId });
      }
      router.replace("/(tabs)");
    } catch (err: any) { console.error(err); }
  }

  async function handleGoogle() {
    const { createdSessionId } = await startOAuthFlow();
    if (createdSessionId) router.replace("/(tabs)");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FinTracker</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{isSignUp ? "Sign Up" : "Sign In"}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogle}>
        <Text style={styles.buttonText}>Continue with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
        <Text style={styles.link}>{isSignUp ? "Have an account? Sign In" : "No account? Sign Up"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#f8fafc" },
  title: { fontSize: 32, fontWeight: "700", textAlign: "center", marginBottom: 32, color: "#0f172a" },
  input: { borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 8, padding: 12, marginBottom: 12, backgroundColor: "#fff" },
  button: { backgroundColor: "#6366f1", padding: 14, borderRadius: 8, alignItems: "center", marginBottom: 8 },
  googleButton: { backgroundColor: "#1e293b", padding: 14, borderRadius: 8, alignItems: "center", marginBottom: 16 },
  buttonText: { color: "#fff", fontWeight: "600" },
  link: { color: "#6366f1", textAlign: "center", marginTop: 8 },
});
```
- [ ] **Step 7: Create app/(tabs)/_layout.tsx (tab navigator)**

```tsx
import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen name="index" options={{ title: "Dashboard", tabBarIcon: () => <Text>$</Text> }} />
      <Tabs.Screen name="transactions" options={{ title: "Transactions", tabBarIcon: () => <Text>#</Text> }} />
      <Tabs.Screen name="add" options={{ title: "Add", tabBarIcon: () => <Text>+</Text> }} />
    </Tabs>
  );
}
```

- [ ] **Step 8: Create app/(tabs)/index.tsx (Dashboard)**

```tsx
import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { api } from "../../src/api/client";

export default function Dashboard() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    api.getAccounts().then(setAccounts);
    api.getTransactions().then(setTransactions);
  }, []);

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <View style={styles.container}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>${(totalBalance / 100).toFixed(2)}</Text>
      </View>
      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      <FlatList
        data={transactions.slice(0, 10)}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => (
          <View style={styles.txItem}>
            <Text>{item.description || "No description"}</Text>
            <Text style={{ color: item.amount > 0 ? "#22c55e" : "#ef4444" }}>
              ${(Math.abs(item.amount) / 100).toFixed(2)}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  balanceCard: { backgroundColor: "#6366f1", padding: 24, borderRadius: 16, marginBottom: 24 },
  balanceLabel: { color: "#c7d2fe", fontSize: 14 },
  balanceAmount: { color: "#fff", fontSize: 36, fontWeight: "700" },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12, color: "#0f172a" },
  txItem: { flexDirection: "row", justifyContent: "space-between", padding: 12, backgroundColor: "#fff", borderRadius: 8, marginBottom: 8 },
});
```
- [ ] **Step 9: Create app/(tabs)/transactions.tsx**

```tsx
import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { api } from "../../src/api/client";

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => { api.getTransactions().then(setTransactions); }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => (
          <View style={styles.txItem}>
            <View>
              <Text style={styles.txDesc}>{item.description || "No description"}</Text>
              <Text style={styles.txDate}>{new Date(item.date).toLocaleDateString()}</Text>
            </View>
            <Text style={{ ...styles.txAmount, color: item.amount > 0 ? "#22c55e" : "#ef4444" }}>
              {item.amount > 0 ? "+" : ""}{"$"}{" "}{(Math.abs(item.amount) / 100).toFixed(2)}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  txItem: { flexDirection: "row", justifyContent: "space-between", padding: 16, backgroundColor: "#fff", borderRadius: 8, marginBottom: 8 },
  txDesc: { fontSize: 16, color: "#0f172a" },
  txDate: { fontSize: 12, color: "#64748b", marginTop: 2 },
  txAmount: { fontSize: 16, fontWeight: "600" },
});
```

- [ ] **Step 10: Create app/(tabs)/add.tsx**

```tsx
import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { api } from "../../src/api/client";

export default function AddTransaction() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [accountId, setAccountId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    api.getAccounts().then(setAccounts);
    api.getCategories().then(setCategories);
  }, []);

  async function handleSave() {
    if (!accountId || !amount) { Alert.alert("Error", "Account and amount are required"); return; }
    const cents = Math.round(parseFloat(amount) * 100);
    try {
      await api.createTransaction({
        accountId, categoryId: categoryId || undefined,
        amount: cents, description,
        date: new Date().toISOString(), source: "manual",
      });
      router.back();
    } catch (err: any) { Alert.alert("Error", err.message); }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Account</Text>
      {accounts.map((a) => (
        <TouchableOpacity key={a.id} style={[styles.option, accountId === a.id && styles.selected]} onPress={() => setAccountId(a.id)}>
          <Text>{a.name}</Text>
        </TouchableOpacity>
      ))}
      <Text style={styles.label}>Amount ($)</Text>
      <TextInput style={styles.input} placeholder="0.00" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />
      <Text style={styles.label}>Description</Text>
      <TextInput style={styles.input} placeholder="What was this for?" value={description} onChangeText={setDescription} />
      <Text style={styles.label}>Category</Text>
      {categories.map((c) => (
        <TouchableOpacity key={c.id} style={[styles.option, categoryId === c.id && styles.selected]} onPress={() => setCategoryId(c.id)}>
          <Text>{c.name}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  label: { fontSize: 14, fontWeight: "600", color: "#475569", marginTop: 16, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 8, padding: 12, backgroundColor: "#fff" },
  option: { padding: 12, backgroundColor: "#fff", borderRadius: 8, marginBottom: 4, borderWidth: 1, borderColor: "#e2e8f0" },
  selected: { borderColor: "#6366f1", backgroundColor: "#eef2ff" },
  saveButton: { backgroundColor: "#6366f1", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 24 },
  saveText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
```

- [ ] **Step 11: Run typecheck**

Run: `pnpm --filter @fintracker/mobile typecheck`

- [ ] **Step 12: Commit**

```bash
git add packages/mobile/
git commit -m "feat: add expo mobile app with auth, dashboard, transactions"
```
