CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"firstName" text NOT NULL,
	"lastName" text NOT NULL,
	"email" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge" (
	"id" serial PRIMARY KEY NOT NULL,
	"metadata" json NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(1536)
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" date NOT NULL,
	"string" text NOT NULL,
	"content" text NOT NULL,
	"answer" text NOT NULL,
	"userId" uuid NOT NULL
);
