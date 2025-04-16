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
CREATE TABLE "option" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(500) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "option_value" (
	"id" serial PRIMARY KEY NOT NULL,
	"option_id" integer NOT NULL,
	"value" varchar(500) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(500) NOT NULL,
	"description" varchar(500),
	"price" integer NOT NULL,
	"image_url" varchar(500),
	"stock_quantity" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "variant" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"name" varchar(500) NOT NULL,
	"sku" varchar(500) NOT NULL,
	"price" integer NOT NULL,
	"stock_quantity" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "variant_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "variant_option" (
	"variant_id" integer NOT NULL,
	"option_id" integer NOT NULL,
	"option_value_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "auth_account" ADD CONSTRAINT "auth_account_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_session" ADD CONSTRAINT "auth_session_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_cart_id_cart_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."cart"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_product_variant_id_variant_id_fk" FOREIGN KEY ("product_variant_id") REFERENCES "public"."variant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "option_value" ADD CONSTRAINT "option_value_option_id_option_id_fk" FOREIGN KEY ("option_id") REFERENCES "public"."option"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variant" ADD CONSTRAINT "variant_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variant_option" ADD CONSTRAINT "variant_option_variant_id_variant_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."variant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variant_option" ADD CONSTRAINT "variant_option_option_id_option_id_fk" FOREIGN KEY ("option_id") REFERENCES "public"."option"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variant_option" ADD CONSTRAINT "variant_option_option_value_id_option_value_id_fk" FOREIGN KEY ("option_value_id") REFERENCES "public"."option_value"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "auth_account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "auth_session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_email_idx" ON "auth_user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "verification_token_identifier_idx" ON "auth_verification_token" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "verification_token_expires_idx" ON "auth_verification_token" USING btree ("expires");--> statement-breakpoint
CREATE INDEX "cart_user_unique" ON "cart" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "cart_id_idx" ON "cart_item" USING btree ("cart_id");--> statement-breakpoint
CREATE INDEX "cart_variant_idx" ON "cart_item" USING btree ("cart_id","product_variant_id");--> statement-breakpoint
CREATE INDEX "option_name_idx" ON "option" USING btree ("name");--> statement-breakpoint
CREATE INDEX "product_name_idx" ON "product" USING btree ("name");--> statement-breakpoint
CREATE INDEX "product_price_idx" ON "product" USING btree ("price");--> statement-breakpoint
CREATE INDEX "variant_product_id_idx" ON "variant" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "variant_sku_idx" ON "variant" USING btree ("sku");--> statement-breakpoint
CREATE INDEX "variant_price_idx" ON "variant" USING btree ("price");--> statement-breakpoint
CREATE INDEX "variant_option_pk" ON "variant_option" USING btree ("variant_id","option_id","option_value_id");--> statement-breakpoint
CREATE INDEX "variant_option_variant_idx" ON "variant_option" USING btree ("variant_id");--> statement-breakpoint
CREATE INDEX "variant_option_option_idx" ON "variant_option" USING btree ("option_id");--> statement-breakpoint
CREATE INDEX "variant_option_option_value_idx" ON "variant_option" USING btree ("option_value_id");