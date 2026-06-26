import { db } from "./index.js";
import { categories } from "./schema.js";

const defaultCategories = [
  { name: "Salary", icon: "wallet", color: "#22c55e", type: "income" as const, isSystem: true },
  { name: "Freelance", icon: "briefcase", color: "#16a34a", type: "income" as const, isSystem: true },
  { name: "Groceries", icon: "shopping-cart", color: "#ef4444", type: "expense" as const, isSystem: true },
  { name: "Rent", icon: "home", color: "#f97316", type: "expense" as const, isSystem: true },
  { name: "Utilities", icon: "zap", color: "#eab308", type: "expense" as const, isSystem: true },
  { name: "Dining", icon: "utensils", color: "#ec4899", type: "expense" as const, isSystem: true },
  { name: "Transport", icon: "car", color: "#8b5cf6", type: "expense" as const, isSystem: true },
  { name: "Shopping", icon: "shopping-bag", color: "#06b6d4", type: "expense" as const, isSystem: true },
  { name: "Healthcare", icon: "heart", color: "#f43f5e", type: "expense" as const, isSystem: true },
  { name: "Entertainment", icon: "film", color: "#d946ef", type: "expense" as const, isSystem: true },
  { name: "Education", icon: "book", color: "#6366f1", type: "expense" as const, isSystem: true },
  { name: "Insurance", icon: "shield", color: "#14b8a6", type: "expense" as const, isSystem: true },
  { name: "Transfer", icon: "arrow-left-right", color: "#78716c", type: "transfer" as const, isSystem: true },
  { name: "Other Income", icon: "plus", color: "#22c55e", type: "income" as const, isSystem: true },
  { name: "Other Expense", icon: "minus", color: "#ef4444", type: "expense" as const, isSystem: true },
];

export async function seed(clerkUserId?: string) {
  for (const cat of defaultCategories) {
    await db.insert(categories).values({ ...cat, clerkUserId: clerkUserId ?? null }).onConflictDoNothing();
  }
}