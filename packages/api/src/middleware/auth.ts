import { verifyToken } from "@clerk/backend";
import type { Request, Response, NextFunction } from "express";
import { env } from "../env.js";

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
    const payload = await verifyToken(token, { secretKey: env.CLERK_SECRET_KEY });
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: "invalid token" });
  }
}