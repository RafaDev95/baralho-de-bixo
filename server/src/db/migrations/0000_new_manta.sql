CREATE TYPE "public"."attribute" AS ENUM('fire', 'water', 'wind');--> statement-breakpoint
CREATE TYPE "public"."card_zone" AS ENUM('library', 'hand', 'battlefield', 'graveyard', 'exile', 'stack');--> statement-breakpoint
CREATE TYPE "public"."rarity" AS ENUM('common', 'uncommon', 'rare', 'epic');--> statement-breakpoint
CREATE TYPE "public"."type" AS ENUM('creature', 'spell', 'enchantment', 'artifact');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "card_counters" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_id" integer NOT NULL,
	"card_id" integer NOT NULL,
	"counter_type" text NOT NULL,
	"amount" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cards" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" "type" NOT NULL,
	"rarity" "rarity" NOT NULL,
	"description" text NOT NULL,
	"attributes" "attribute" NOT NULL,
	"power" integer,
	"health" integer,
	"mana_cost" jsonb NOT NULL,
	"abilities" jsonb,
	"is_legendary" boolean DEFAULT false,
	"is_token" boolean DEFAULT false,
	"can_attack" boolean DEFAULT true,
	"can_block" boolean DEFAULT true,
	"has_summoning_sickness" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "players" (
	"id" serial PRIMARY KEY NOT NULL,
	"wallet_address" varchar(42) NOT NULL,
	"username" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"balance" integer DEFAULT 0,
	"rank" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3),
	CONSTRAINT "players_wallet_address_unique" UNIQUE("wallet_address"),
	CONSTRAINT "players_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "decks" (
	"id" serial PRIMARY KEY NOT NULL,
	"player_id" integer,
	"name" varchar(255) NOT NULL,
	"is_active" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deck_cards" (
	"id" serial PRIMARY KEY NOT NULL,
	"deck_id" integer,
	"card_id" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trades" (
	"id" serial PRIMARY KEY NOT NULL,
	"seller_id" integer,
	"buyer_id" integer,
	"card_id" integer,
	"price" integer NOT NULL,
	"status" varchar(50) DEFAULT 'open' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3),
	"completedAt" timestamp (3)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_challenges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"address" varchar(42) NOT NULL,
	"nonce" varchar(255) NOT NULL,
	"message" varchar(1000) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"is_used" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "auth_challenges_nonce_unique" UNIQUE("nonce")
);
