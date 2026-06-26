# Task 2: Shared Zod Schemas and Types

**Files:**
- Create: `packages/shared/src/index.ts`
- Create: `packages/shared/src/schemas/account.ts`
- Create: `packages/shared/src/schemas/transaction.ts`
- Create: `packages/shared/src/schemas/category.ts`
- Create: `packages/shared/src/types/index.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `AccountSchema`, `TransactionSchema`, `CategorySchema` (Zod schemas) and `Account`, `Transaction`, `Category` (TS types) — used by both API and mobile

## Step 1: Create packages/shared/src/schemas/account.ts
```typescript
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
```

## Step 2: Create packages/shared/src/schemas/category.ts
```typescript
import { z } from "zod";

export const CategoryTypeEnum = z.enum(["expense", "income", "transfer"]);

export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(50),
  icon: z.string().max(50).default("tag"),
  color: z.string().max(7).default("#6366f1"),
  type: CategoryTypeEnum,
  isSystem: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateCategorySchema = CategorySchema.omit({
  id: true, isSystem: true, createdAt: true, updatedAt: true,
});
```

## Step 3: Create packages/shared/src/schemas/transaction.ts
```typescript
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
```

## Step 4: Create packages/shared/src/types/index.ts
```typescript
import { z } from "zod";
import { AccountSchema, CreateAccountSchema, UpdateAccountSchema } from "../schemas/account.js";
import { CategorySchema, CreateCategorySchema } from "../schemas/category.js";
import { TransactionSchema, CreateTransactionSchema, UpdateTransactionSchema } from "../schemas/transaction.js";

export type Account = z.infer<typeof AccountSchema>;
export type CreateAccount = z.infer<typeof CreateAccountSchema>;
export type UpdateAccount = z.infer<typeof UpdateAccountSchema>;

export type Category = z.infer<typeof CategorySchema>;
export type CreateCategory = z.infer<typeof CreateCategorySchema>;

export type Transaction = z.infer<typeof TransactionSchema>;
export type CreateTransaction = z.infer<typeof CreateTransactionSchema>;
export type UpdateTransaction = z.infer<typeof UpdateTransactionSchema>;
```

## Step 5: Create packages/shared/src/index.ts (barrel export)
```typescript
export * from "./schemas/account.js";
export * from "./schemas/category.js";
export * from "./schemas/transaction.js";
export * from "./types/index.js";
```

## Step 6: Run typecheck
Run: `pnpm --filter @fintracker/shared typecheck`
Expected: no errors

## Step 7: Commit
```bash
git add packages/shared/
git commit -m "feat: add shared zod schemas and types"
```
