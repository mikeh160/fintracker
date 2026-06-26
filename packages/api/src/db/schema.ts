import { pgTable, uuid, text, bigint, boolean, timestamp, varchar, pgEnum, unique } from "drizzle-orm/pg-core";

export const accountTypeEnum = pgEnum("account_type", ["cash", "credit", "debit", "investment"]);

export const accounts = pgTable("accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: text("clerk_user_id").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  type: accountTypeEnum("type").notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("USD"),
  balance: bigint("balance", { mode: "number" }).notNull().default(0),
  lastFour: varchar("last_four", { length: 4 }),
  includedInTotals: boolean("included_in_totals").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: text("clerk_user_id"),
  name: varchar("name", { length: 50 }).notNull(),
  icon: varchar("icon", { length: 50 }).notNull().default("tag"),
  color: varchar("color", { length: 7 }).notNull().default("#6366f1"),
  type: text("type", { enum: ["expense", "income", "transfer"] }).notNull(),
  isSystem: boolean("is_system").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  uniqueNameSystem: unique().on(table.name, table.isSystem),
}));

export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  accountId: uuid("account_id").notNull().references(() => accounts.id),
  clerkUserId: text("clerk_user_id").notNull(),
  amount: bigint("amount", { mode: "number" }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("USD"),
  description: text("description").notNull().default(""),
  categoryId: uuid("category_id").references(() => categories.id),
  tags: text("tags").array().notNull().default([]),
  date: timestamp("date").notNull().defaultNow(),
  isParsed: boolean("is_parsed").notNull().default(false),
  source: text("source", { enum: ["manual", "sms", "gmail"] }).notNull().default("manual"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});