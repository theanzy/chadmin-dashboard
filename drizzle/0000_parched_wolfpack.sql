CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"city" varchar(256),
	"country" varchar(3),
	"role" varchar(128),
	"created_at" timestamp
);
