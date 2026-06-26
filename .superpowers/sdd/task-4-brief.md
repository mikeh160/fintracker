# Task 4: Auth — Clerk Webhook + API Middleware

**Files:**
- Create: `packages/api/src/middleware/auth.ts`
- Create: `packages/api/src/routes/auth.ts`
- Modify: `packages/api/src/index.ts` (create it)

**Interfaces:**
- Consumes: `env` from Task 3
- Produces: `requireAuth` middleware (Express), webhook route

## Step 1: Create packages/api/src/middleware/auth.ts
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
    req.userId = session.userId;
    next();
  } catch {
    return res.status(401).json({ error: "invalid token" });
  }
}
```

Note: `{ client: "mobile" } as any` is a pragmatic cast — the Clerk SDK types for verifySession vary by version. The actual API works with the session token.

## Step 2: Create packages/api/src/routes/auth.ts
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

## Step 3: Create packages/api/src/index.ts (API entry point)
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
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.listen(env.PORT, () => console.log(`api listening on port ${env.PORT}`));
export default app;
```

## Step 4: Add svix dependency
Add `"svix": "^1.30.0"` to the dependencies in `packages/api/package.json`.

## Step 5: Verify
Run: `pnpm install`
Run: `pnpm --filter @fintracker/api typecheck`
Expected: no errors

## Step 6: Commit
```bash
git add packages/api/src/middleware/ packages/api/src/routes/auth.ts packages/api/src/index.ts packages/api/package.json
git commit -m "feat: add auth middleware and clerk webhook"
```
