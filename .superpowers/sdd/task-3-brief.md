# Task 3: Database Schema + Drizzle Setup

**Files:**
- Create: `packages/api/src/db/schema.ts`
- Create: `packages/api/src/db/index.ts`
- Create: `packages/api/src/db/seed.ts`
- Create: `packages/api/drizzle.config.ts`
- Create: `packages/api/src/env.ts`
- Create: `packages/api/.env`

**Interfaces:**
- Consumes: nothing directly (env is self-contained)
- Produces: `db` (Drizzle client), schema object with all table definitions, `seed()` function

## Step 1: Create packages/api/src/env.ts
```typescript
import "dotenv/config";

export const env = {
  DATABASE_URL: process.env.DATABASE_URL ?? "postgres://localhost:5432/fintracker",
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ?? "",
  PORT: parseInt(process.env.PORT ?? "3001", 10),
};
```

## Step 2: Create packages/api/drizzle.config.ts
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

## Step 3: Create packages/api/src/db/schema.ts
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

## Step 4: Create packages/api/src/db/index.ts
```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../env.js";
import * as schema from "./schema.js";

const client = postgres(env.DATABASE_URL);
export const db = drizzle(client, { schema });
export type DB = typeof db;
```

## Step 5: Create packages/api/src/db/seed.ts
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

export async function seed() {
  for (const cat of defaultCategories) {
    await db.insert(categories).values(cat).onConflictDoNothing();
  }
}
```

## Step 6: Run typecheck and generate migrations
Run: `pnpm --filter @fintracker/api typecheck`
Expected: no errors

Run: `pnpm --filter @fintracker/api exec drizzle-kit generate`
Expected: drizzle/ directory created with migration SQL files

## Step 7: Commit
```bash
git add packages/api/src/db/ packages/api/drizzle.config.ts packages/api/.env packages/api/drizzle/
git commit -m "feat: add drizzle schema, db client, and seed data"
```
