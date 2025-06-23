import {
	jsonb,
	integer,
	varchar,
	pgTable,
	serial,
	boolean,
	timestamp,
} from "drizzle-orm/pg-core";

// Track triggered abilities
export const triggeredAbilitiesTable = pgTable("triggered_abilities", {
	id: serial("id").primaryKey(),
	game_id: integer("game_id").notNull(),
	card_id: integer("card_id").notNull(),
	trigger_type: varchar("trigger_type", { length: 50 }).notNull(),
	effect: jsonb("effect").notNull(),
	is_resolved: boolean("is_resolved").default(false),
	created_at: timestamp("created_at").notNull().defaultNow(),
});
