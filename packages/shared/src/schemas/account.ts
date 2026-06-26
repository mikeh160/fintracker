import { z } from "zod";

export const AccountTypeEnum = z.enum(["cash", "credit", "debit", "investment"]);
export const CurrencyEnum = z.enum(["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "INR", "BRL"]);

export const AccountSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  type: AccountTypeEnum,
  currency: CurrencyEnum,
  balance: z.number().int(),
  lastFour: z.string().length(4).nullable().optional(),
  includedInTotals: z.boolean().default(true),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateAccountSchema = AccountSchema.omit({
  id: true, createdAt: true, updatedAt: true,
});

export const UpdateAccountSchema = CreateAccountSchema.partial();