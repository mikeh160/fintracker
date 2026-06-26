import { Router } from "express";
import type { Router as RouterType, Request, Response } from "express";
import { Webhook } from "svix";

const router: RouterType = Router();
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