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