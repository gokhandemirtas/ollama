CREATE TABLE "characters" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdOn" timestamp NOT NULL,
	"updatedOn" timestamp,
	"name" text NOT NULL,
	"race" text NOT NULL,
	"class" text NOT NULL,
	"alignment" text NOT NULL,
	"abilityScores" json NOT NULL,
	"backstory" text NOT NULL,
	"userId" uuid NOT NULL
);
