import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Cat Image schema
export const breedSchema = z.object({
  name: z.string(),
  temperament: z.string().optional(),
  description: z.string().optional(),
  origin: z.string().optional(),
  life_span: z.string().optional(),
});

export const catImageSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  width: z.number().optional(),
  height: z.number().optional(),
  attribution: z.string().optional(),
  breeds: z.array(breedSchema).optional(),
});

export type CatImage = z.infer<typeof catImageSchema>;
