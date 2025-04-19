CREATE TYPE "public"."user_language" AS ENUM('en', 'fr');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'owner', 'user', 'investigator', 'staff', 'paid', 'blocked');--> statement-breakpoint
CREATE TABLE "auth_account" (
	"user_id" varchar(500) NOT NULL,
	"type" varchar(500) NOT NULL,
	"provider" varchar(500) NOT NULL,
	"provider_account_id" varchar(500) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(500),
	"scope" varchar(500),
	"id_token" text,
	"session_state" varchar(500),
	CONSTRAINT "auth_account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "auth_session" (
	"session_token" varchar(500) PRIMARY KEY NOT NULL,
	"user_id" varchar(500) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_user" (
	"id" varchar(500) PRIMARY KEY NOT NULL,
	"name" varchar(500),
	"email" varchar(500) NOT NULL,
	"email_verified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(500),
	"roles" "user_role"[] DEFAULT '{"user"}' NOT NULL,
	"language" "user_language" DEFAULT 'en' NOT NULL,
	"phone" varchar(500),
	"last_login" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "auth_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "auth_verification_token" (
	"identifier" varchar(500) NOT NULL,
	"token" varchar(500) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "auth_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "cart" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(500) NOT NULL,
	"date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "cart_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"cart_id" integer NOT NULL,
	"product_variant_id" integer,
	"quantity" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "option_values" (
	"id" serial PRIMARY KEY NOT NULL,
	"value" varchar(255) NOT NULL,
	"option_id" integer
);
--> statement-breakpoint
CREATE TABLE "product_options" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"product_id" integer
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"price" numeric(10, 2) DEFAULT '0' NOT NULL,
	"stock_quantity" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "variant_option_values" (
	"id" serial PRIMARY KEY NOT NULL,
	"variant_id" integer,
	"option_value_id" integer
);
--> statement-breakpoint
CREATE TABLE "variants" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"sku" varchar(50) NOT NULL,
	"price" numeric(10, 2) DEFAULT '0' NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "auth_account" ADD CONSTRAINT "auth_account_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_session" ADD CONSTRAINT "auth_session_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_cart_id_cart_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."cart"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_product_variant_id_variants_id_fk" FOREIGN KEY ("product_variant_id") REFERENCES "public"."variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "option_values" ADD CONSTRAINT "option_values_option_id_product_options_id_fk" FOREIGN KEY ("option_id") REFERENCES "public"."product_options"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_options" ADD CONSTRAINT "product_options_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variant_option_values" ADD CONSTRAINT "variant_option_values_variant_id_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variant_option_values" ADD CONSTRAINT "variant_option_values_option_value_id_option_values_id_fk" FOREIGN KEY ("option_value_id") REFERENCES "public"."option_values"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variants" ADD CONSTRAINT "variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "auth_account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "auth_session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_email_idx" ON "auth_user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "verification_token_identifier_idx" ON "auth_verification_token" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "verification_token_expires_idx" ON "auth_verification_token" USING btree ("expires");--> statement-breakpoint
CREATE INDEX "cart_user_unique" ON "cart" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "cart_id_idx" ON "cart_item" USING btree ("cart_id");--> statement-breakpoint
CREATE INDEX "cart_variant_idx" ON "cart_item" USING btree ("cart_id","product_variant_id");--> statement-breakpoint
CREATE INDEX "option_values_option_id_idx" ON "option_values" USING btree ("option_id");--> statement-breakpoint
CREATE INDEX "product_options_product_id_idx" ON "product_options" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_name_idx" ON "products" USING btree ("name");--> statement-breakpoint
CREATE INDEX "variant_option_values_variant_id_idx" ON "variant_option_values" USING btree ("variant_id");--> statement-breakpoint
CREATE INDEX "variant_option_values_option_value_id_idx" ON "variant_option_values" USING btree ("option_value_id");--> statement-breakpoint
CREATE INDEX "variants_product_id_idx" ON "variants" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "variants_sku_idx" ON "variants" USING btree ("sku");