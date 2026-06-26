import { Router } from "express";
import { eq, or, isNull } from "drizzle-orm";
import { db } from "../db/index.js";
import { categories } from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";
import type { AuthRequest } from "../middleware/auth.js";
import { CreateCategorySchema } from "@fintracker/shared";

const router: Router = Router();
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