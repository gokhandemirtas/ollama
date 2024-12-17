import { json, pgTable, serial, text, vector } from "drizzle-orm/pg-core";

export const knowledgeSchema = pgTable("knowledge", {
  id: serial("id").primaryKey(),
  metadata: json("metadata").notNull(),
  content : text("content").notNull(),
  embedding: vector("embedding", { dimensions: 1536 })
});
