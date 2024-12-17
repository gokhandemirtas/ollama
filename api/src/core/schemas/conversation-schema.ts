import { date, pgTable, serial, text, uuid } from "drizzle-orm/pg-core";

export const conversationSchema = pgTable("conversations", {
  id: serial("id").primaryKey(),
  timestamp: date("timestamp").notNull(),
  role: text("string").notNull(), /* Bunu nasil kisitlarim enum gibi ? */
  question: text("content").notNull(),
  answer: text("answer").notNull(),
  userId: uuid("userId").notNull(),
});
