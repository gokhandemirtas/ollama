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
	"metadata" jsonb,
	"content" text NOT NULL,
	"source" text NOT NULL,
	"category" text NOT NULL,
	"embedding" vector(768)
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" date NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"userId" uuid NOT NULL
);
