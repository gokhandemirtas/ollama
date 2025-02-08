import { jsonb, pgTable, serial, text, vector } from "drizzle-orm/pg-core";

export const knowledgeSchema = pgTable("knowledge", {
  id: serial("id").primaryKey(),
  metadata: jsonb("metadata"),
  content: text("content").notNull(),
  source: text("source").notNull(),
  category: text("category").notNull(),
  embedding: vector("embedding", { dimensions: 384 })
});
