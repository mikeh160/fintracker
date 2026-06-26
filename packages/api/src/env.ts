import "dotenv/config";

export const env = {
  DATABASE_URL: process.env.DATABASE_URL ?? "postgres://localhost:5432/fintracker",
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ?? "",
  CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET ?? "",
  PORT: parseInt(process.env.PORT ?? "3001", 10),
};