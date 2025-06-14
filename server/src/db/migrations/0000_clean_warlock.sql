CREATE TYPE "public"."attribute" AS ENUM('fire', 'water', 'wind');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cards" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"rarity" text NOT NULL,
	"attributes" "attribute",
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
	"completed_at" timestamp
);
