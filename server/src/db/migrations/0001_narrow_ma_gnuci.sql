ALTER TABLE "public"."cards" ALTER COLUMN "rarity" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."rarity";--> statement-breakpoint
CREATE TYPE "public"."rarity" AS ENUM('common', 'uncommon', 'rare', 'mythic');--> statement-breakpoint
ALTER TABLE "public"."cards" ALTER COLUMN "rarity" SET DATA TYPE "public"."rarity" USING "rarity"::"public"."rarity";