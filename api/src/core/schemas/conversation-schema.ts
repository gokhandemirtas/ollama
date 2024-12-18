import { date, pgTable, serial, text, uuid } from "drizzle-orm/pg-core";

export const conversationSchema = pgTable("conversations", {
  id: serial("id").primaryKey(),
  timestamp: date("timestamp").notNull(),
  role: text("role").notNull(), /* Bunu nasil kisitlarim enum gibi ? */
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  userId: uuid("userId").notNull(),
});
