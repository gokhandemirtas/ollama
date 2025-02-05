ALTER TABLE "characters" ALTER COLUMN "inventory" SET DATA TYPE json;--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "armorClass" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "proficiencies" json NOT NULL;