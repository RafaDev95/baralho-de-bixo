DROP TABLE "auth_challenges" CASCADE;--> statement-breakpoint
DROP TABLE "mana_pools" CASCADE;--> statement-breakpoint
DROP TABLE "trades" CASCADE;--> statement-breakpoint
ALTER TABLE "cards" DROP COLUMN IF EXISTS "colors";--> statement-breakpoint
DROP TYPE "public"."color";