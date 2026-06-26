# Task 5: API CRUD Routes — Accounts, Transactions, Categories

**Files:**
- Create: `packages/api/src/routes/accounts.ts`
- Create: `packages/api/src/routes/transactions.ts`
- Create: `packages/api/src/routes/categories.ts`
- Modify: `packages/api/src/index.ts` — mount new routes

**Interfaces:**
- Consumes: `db` and schema tables from Task 3, `requireAuth`/`AuthRequest` from Task 4, shared Zod schemas from Task 2
- Produces: REST CRUD endpoints for all three entities

## Step 1: Create packages/api/src/routes/accounts.ts
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

## Step 2: Create packages/api/src/routes/transactions.ts
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

## Step 3: Create packages/api/src/routes/categories.ts
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

## Step 4: Update packages/api/src/index.ts
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

## Step 5: Verify
Run: `pnpm --filter @fintracker/api typecheck`
Expected: no errors

## Step 6: Commit
```bash
git add packages/api/src/routes/ packages/api/src/index.ts
git commit -m "feat: add accounts, transactions, categories CRUD routes"
```
