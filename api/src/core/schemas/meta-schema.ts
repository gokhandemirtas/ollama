import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const metaSchema = pgTable("meta", {
  id: serial("id").primaryKey(),
  classes: text("classes").array(),
  races: text("races").array(),
  alignments: text("alignments").array(),
});
