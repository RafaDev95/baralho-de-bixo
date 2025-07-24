CREATE TYPE "public"."deck_type" AS ENUM('starter', 'custom');--> statement-breakpoint
CREATE TYPE "public"."card_zone" AS ENUM('library', 'hand', 'battlefield', 'graveyard', 'exile', 'stack');--> statement-breakpoint
CREATE TYPE "public"."color" AS ENUM('white', 'blue', 'black', 'red', 'green', 'colorless');--> statement-breakpoint
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
	"colors" jsonb NOT NULL,
	"power" integer,
	"health" integer,
	"mana_cost" jsonb NOT NULL,
	"abilities" jsonb,
	"is_legendary" boolean DEFAULT false,
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
	"card_count" integer DEFAULT 0 NOT NULL,
	"type" integer NOT NULL,
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
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "card_positions" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_id" integer NOT NULL,
	"card_id" integer NOT NULL,
	"player_id" integer NOT NULL,
	"zone" "card_zone" NOT NULL,
	"position" integer,
	"is_tapped" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "combat_states" (
	"id" serial PRIMARY KEY NOT NULL,
	"turn_id" integer NOT NULL,
	"attacker_id" integer NOT NULL,
	"blocker_id" integer,
	"damage_amount" integer NOT NULL,
	"is_blocked" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "game_states" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_id" integer NOT NULL,
	"player_id" integer NOT NULL,
	"hand_size" integer NOT NULL,
	"deck_size" integer NOT NULL,
	"graveyard_size" integer NOT NULL,
	"life_total" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "games" (
	"id" serial PRIMARY KEY NOT NULL,
	"player1_id" integer NOT NULL,
	"player2_id" integer NOT NULL,
	"current_turn" integer DEFAULT 1,
	"current_player_id" integer NOT NULL,
	"phase" varchar(20) NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mana_pools" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_id" integer NOT NULL,
	"player_id" integer NOT NULL,
	"red_mana" integer DEFAULT 0,
	"blue_mana" integer DEFAULT 0,
	"green_mana" integer DEFAULT 0,
	"generic_mana" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stack" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_id" integer NOT NULL,
	"card_id" integer NOT NULL,
	"player_id" integer NOT NULL,
	"position" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "turn_actions" (
	"id" serial PRIMARY KEY NOT NULL,
	"turn_id" integer NOT NULL,
	"player_id" integer NOT NULL,
	"action_type" varchar(50) NOT NULL,
	"card_id" integer,
	"target_id" integer,
	"action_data" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "turns" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_id" integer NOT NULL,
	"turn_number" integer NOT NULL,
	"player_id" integer NOT NULL,
	"phase" varchar(20) NOT NULL,
	"current_phase" varchar(20) NOT NULL,
	"priority_player_id" integer,
	"has_played_land" boolean DEFAULT false,
	"has_attacked" boolean DEFAULT false,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"ended_at" timestamp
);
