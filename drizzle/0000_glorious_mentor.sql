CREATE SCHEMA "chadmin_dashboard";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chadmin_dashboard"."products" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"price" integer NOT NULL,
	"description" varchar(1024) NOT NULL,
	"category" varchar(128) NOT NULL,
	"rating" smallint NOT NULL,
	"supply" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chadmin_dashboard"."products_transactions" (
	"transaction_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	CONSTRAINT products_transactions_transaction_id_product_id PRIMARY KEY("transaction_id","product_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chadmin_dashboard"."transactions" (
	"id" integer PRIMARY KEY NOT NULL,
	"affiliate_id" integer NOT NULL,
	"customer_id" integer NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chadmin_dashboard"."users" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"city" varchar(256) NOT NULL,
	"country" varchar(3) NOT NULL,
	"role" varchar(128) NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chadmin_dashboard"."products_transactions" ADD CONSTRAINT "products_transactions_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "chadmin_dashboard"."transactions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chadmin_dashboard"."products_transactions" ADD CONSTRAINT "products_transactions_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "chadmin_dashboard"."products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chadmin_dashboard"."transactions" ADD CONSTRAINT "transactions_affiliate_id_users_id_fk" FOREIGN KEY ("affiliate_id") REFERENCES "chadmin_dashboard"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chadmin_dashboard"."transactions" ADD CONSTRAINT "transactions_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "chadmin_dashboard"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
