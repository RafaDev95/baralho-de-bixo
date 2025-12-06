ALTER TABLE "card_counters" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "password_hash" varchar(255) NOT NULL;