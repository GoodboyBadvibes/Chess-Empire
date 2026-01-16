import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

// Roles/Jobs for the "small but powerful team"
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // e.g., "Media", "Design", "Engineering"
  isActive: boolean("is_active").default(true),
});

// Applications from "high-agency individuals"
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  roleId: integer("role_id").references(() => roles.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(), // "Why you?"
  portfolioUrl: text("portfolio_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Products (Boards, Merch)
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // in cents
  category: text("category").notNull(), // "Board", "Merch", "Digital"
  imageUrl: text("image_url").notNull(),
});

// Stories (Human element)
export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  imageUrl: text("image_url"),
  publishedAt: timestamp("published_at").defaultNow(),
});

// === SCHEMAS ===
export const insertRoleSchema = createInsertSchema(roles).omit({ id: true });
export const insertApplicationSchema = createInsertSchema(applications).omit({ id: true, createdAt: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertStorySchema = createInsertSchema(stories).omit({ id: true, publishedAt: true });

// === TYPES ===
export type Role = typeof roles.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Story = typeof stories.$inferSelect;

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
