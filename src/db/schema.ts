import { pgTable, serial, varchar, text, integer, jsonb, timestamp, real } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }),
  price: integer("price").notNull(),
  oldPrice: integer("old_price"),
  category: varchar("category", { length: 100 }),
  image: text("image"),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  colors: jsonb("colors").$type<{ name: string; hex: string }[]>().notNull().default([]),
  sizes: jsonb("sizes").$type<string[]>().notNull().default([]),
  rating: real("rating").notNull().default(5),
  reviewsCount: integer("reviews_count").notNull().default(0),
  description: text("description").default(""),
  specs: jsonb("specs").$type<{ label: string; value: string }[]>().notNull().default([]),
  reviews: jsonb("reviews").$type<{ author: string; rating: number; comment: string; date: string }[]>().notNull().default([]),
  stock: integer("stock").default(0),
  badge: varchar("badge", { length: 20 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  productName: varchar("product_name", { length: 255 }).notNull(),
  price: integer("price").notNull(),
  quantity: integer("quantity").notNull().default(1),
  shipping: integer("shipping").notNull().default(60),
  color: varchar("color", { length: 64 }),
  size: varchar("size", { length: 32 }),
  customerName: varchar("customer_name", { length: 128 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  address: text("address").notNull(),
  notes: text("notes"),
  status: varchar("status", { length: 32 }).notNull().default("جديد"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type ProductRow = typeof products.$inferSelect;
export type NewProductRow = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
