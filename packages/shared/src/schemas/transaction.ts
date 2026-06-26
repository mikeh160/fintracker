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