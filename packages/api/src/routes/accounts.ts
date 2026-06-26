import { Router } from "express";
import { eq, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { accounts } from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";
import type { AuthRequest } from "../middleware/auth.js";
import { CreateAccountSchema } from "@fintracker/shared";

const router: Router = Router();
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
    and(eq(accounts.id, req.params.id!), eq(accounts.clerkUserId, req.userId!)),
  );
  if (!row) return res.status(404).json({ error: "not found" });
  res.json(row);
});

router.patch("/:id", async (req: AuthRequest, res) => {
  const [row] = await db.update(accounts).set(req.body).where(
    and(eq(accounts.id, req.params.id!), eq(accounts.clerkUserId, req.userId!)),
  ).returning();
  if (!row) return res.status(404).json({ error: "not found" });
  res.json(row);
});

router.delete("/:id", async (req: AuthRequest, res) => {
  const [row] = await db.delete(accounts).where(
    and(eq(accounts.id, req.params.id!), eq(accounts.clerkUserId, req.userId!)),
  ).returning();
  if (!row) return res.status(404).json({ error: "not found" });
  res.json({ deleted: true });
});

export default router;