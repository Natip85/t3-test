CREATE TYPE "public"."user_language" AS ENUM('en', 'fr');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'owner', 'user', 'investigator', 'staff', 'paid', 'blocked');--> statement-breakpoint
CREATE TABLE "t3-test-auth_account" (
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
	CONSTRAINT "t3-test-auth_account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "t3-test-auth_session" (
	"session_token" varchar(500) PRIMARY KEY NOT NULL,
	"user_id" varchar(500) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "t3-test-auth_user" (
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
	CONSTRAINT "t3-test-auth_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "t3-test-auth_verification_token" (
	"identifier" varchar(500) NOT NULL,
	"token" varchar(500) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "t3-test-auth_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "t3-testcart" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(500) NOT NULL,
	"date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "t3-testcart_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"cart_id" integer NOT NULL,
	"product_variant_id" integer,
	"quantity" integer DEFAULT 1 NOT NULL,
	"date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "t3-testproduct" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_id" text NOT NULL,
	"name" varchar(500) NOT NULL,
	"description" varchar(500),
	"price" integer NOT NULL,
	"image_url" varchar(500),
	"stock_quantity" integer NOT NULL,
	"date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "t3-testproduct_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
CREATE TABLE "t3-testproduct_variant" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"sku" varchar(500) NOT NULL,
	"price" integer NOT NULL,
	"stock_quantity" integer NOT NULL,
	"color" varchar(500),
	"size" varchar(500),
	"date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "t3-testproduct_variant_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
ALTER TABLE "t3-test-auth_account" ADD CONSTRAINT "t3-test-auth_account_user_id_t3-test-auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."t3-test-auth_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "t3-test-auth_session" ADD CONSTRAINT "t3-test-auth_session_user_id_t3-test-auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."t3-test-auth_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "t3-testcart" ADD CONSTRAINT "t3-testcart_user_id_t3-test-auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."t3-test-auth_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "t3-testcart_item" ADD CONSTRAINT "t3-testcart_item_cart_id_t3-testcart_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."t3-testcart"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "t3-testcart_item" ADD CONSTRAINT "t3-testcart_item_product_variant_id_t3-testproduct_variant_id_fk" FOREIGN KEY ("product_variant_id") REFERENCES "public"."t3-testproduct_variant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "t3-testproduct_variant" ADD CONSTRAINT "t3-testproduct_variant_product_id_t3-testproduct_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."t3-testproduct"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "t3-test-auth_account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "t3-test-auth_session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_email_idx" ON "t3-test-auth_user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "verification_token_identifier_idx" ON "t3-test-auth_verification_token" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "verification_token_expires_idx" ON "t3-test-auth_verification_token" USING btree ("expires");--> statement-breakpoint
CREATE INDEX "cart_user_unique" ON "t3-testcart" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "cart_id_idx" ON "t3-testcart_item" USING btree ("cart_id");--> statement-breakpoint
CREATE INDEX "cart_variant_idx" ON "t3-testcart_item" USING btree ("cart_id","product_variant_id");--> statement-breakpoint
CREATE INDEX "product_name_idx" ON "t3-testproduct" USING btree ("name");--> statement-breakpoint
CREATE INDEX "product_variant_product_id_idx" ON "t3-testproduct_variant" USING btree ("product_id");