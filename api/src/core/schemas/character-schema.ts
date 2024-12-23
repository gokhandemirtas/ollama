import { json, pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { update } from "lodash-es";

export const characterSchema = pgTable("characters", {
  id: serial("id").primaryKey(),
  createdOn: timestamp("createdOn").notNull(),
  updatedOn: timestamp("updatedOn"),
  name: text("name").notNull(),
  race: text("race").notNull(),
  class: text("class").notNull(),
  alignment: text("alignment").notNull(),
  abilityScores: json("abilityScores").notNull(),
  level: json("level").notNull(),
  inventory: text("inventory").notNull(),
  backstory: text("backstory").notNull(),
  userId: uuid("userId").notNull(),
});
