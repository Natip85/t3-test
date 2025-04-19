CREATE TYPE "public"."asset_type" AS ENUM('image', 'video', 'website', 'social-media', 'email', 'profile', 'app', 'other');--> statement-breakpoint
CREATE TABLE "product_asset" (
	"id" serial PRIMARY KEY NOT NULL,
	"prod_id" integer NOT NULL,
	"asset_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp,
	CONSTRAINT "product_asset_unique_pair_idx" UNIQUE("prod_id","asset_id")
);
--> statement-breakpoint
CREATE TABLE "variant_asset" (
	"id" serial PRIMARY KEY NOT NULL,
	"varia_id" integer NOT NULL,
	"assett_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp,
	CONSTRAINT "variant_asset_unique_pair_idx" UNIQUE("varia_id","assett_id")
);
--> statement-breakpoint
CREATE TABLE "asset" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" varchar(500),
	"type" "asset_type" NOT NULL,
	"url" varchar(500) NOT NULL,
	"original_url" varchar(500),
	"file_info" jsonb,
	"created_by_user_id" varchar(500) NOT NULL,
	"capture_date" timestamp with time zone,
	"deleted_at" timestamp,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "product_asset" ADD CONSTRAINT "product_asset_prod_id_products_id_fk" FOREIGN KEY ("prod_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_asset" ADD CONSTRAINT "product_asset_asset_id_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."asset"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variant_asset" ADD CONSTRAINT "variant_asset_varia_id_variants_id_fk" FOREIGN KEY ("varia_id") REFERENCES "public"."variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variant_asset" ADD CONSTRAINT "variant_asset_assett_id_asset_id_fk" FOREIGN KEY ("assett_id") REFERENCES "public"."asset"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset" ADD CONSTRAINT "asset_created_by_user_id_auth_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."auth_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "product_asset_product_id_idx" ON "product_asset" USING btree ("prod_id");--> statement-breakpoint
CREATE INDEX "product_asset_asset_id_idx" ON "product_asset" USING btree ("asset_id");--> statement-breakpoint
CREATE INDEX "variant_asset_variant_id_idx" ON "variant_asset" USING btree ("varia_id");--> statement-breakpoint
CREATE INDEX "variant_asset_asset_id_idx" ON "variant_asset" USING btree ("assett_id");--> statement-breakpoint
CREATE INDEX "asset_created_by_user_id_idx" ON "asset" USING btree ("created_by_user_id");--> statement-breakpoint
CREATE INDEX "asset_type_idx" ON "asset" USING btree ("type");--> statement-breakpoint
CREATE INDEX "asset_url_idx" ON "asset" USING btree ("url");