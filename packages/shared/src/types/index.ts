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