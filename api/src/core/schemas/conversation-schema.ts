import { date, pgTable, serial, text, uuid } from "drizzle-orm/pg-core";

export const conversationSchema = pgTable("conversations", {
  id: serial("id").primaryKey(),
  timestamp: date("timestamp").notNull(),
  role: text("role").notNull(), /* Bunu nasil kisitlarim enum gibi ? */
  content: text("content").notNull(),
  userId: uuid("userId").notNull(),
});
