import { Router } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db } from "../db/index.js";
import { transactions } from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";
import type { AuthRequest } from "../middleware/auth.js";
import { CreateTransactionSchema } from "@fintracker/shared";

const router: Router = Router();
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
  const { date, ...rest } = CreateTransactionSchema.parse(req.body);
  const [row] = await db.insert(transactions).values({ ...rest, date: new Date(date), clerkUserId: req.userId! }).returning();
  res.status(201).json(row);
});

router.get("/:id", async (req: AuthRequest, res) => {
  const [row] = await db.select().from(transactions).where(
    and(eq(transactions.id, req.params.id!), eq(transactions.clerkUserId, req.userId!)),
  );
  if (!row) return res.status(404).json({ error: "not found" });
  res.json(row);
});

router.patch("/:id", async (req: AuthRequest, res) => {
  const [row] = await db.update(transactions).set(req.body).where(
    and(eq(transactions.id, req.params.id!), eq(transactions.clerkUserId, req.userId!)),
  ).returning();
  if (!row) return res.status(404).json({ error: "not found" });
  res.json(row);
});

router.delete("/:id", async (req: AuthRequest, res) => {
  const [row] = await db.delete(transactions).where(
    and(eq(transactions.id, req.params.id!), eq(transactions.clerkUserId, req.userId!)),
  ).returning();
  if (!row) return res.status(404).json({ error: "not found" });
  res.json({ deleted: true });
});

export default router;