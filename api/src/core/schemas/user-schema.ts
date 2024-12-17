import { pgTable, serial, text, uuid } from "drizzle-orm/pg-core";

export const userSchema = pgTable("users", {
  id: serial("id").primaryKey(),
  userId: uuid("userId").notNull(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  email: text("email").notNull(),
});
