import { pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const conversationSchema = pgTable("conversations", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull(),
  role: text("role").notNull(), /* Bunu nasil kisitlarim enum gibi ? */
  content: text("content").notNull(),
  userId: uuid("userId").notNull(),
});
