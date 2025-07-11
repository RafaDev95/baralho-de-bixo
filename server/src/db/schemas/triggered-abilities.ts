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
	gameId: integer("game_id").notNull(),
	cardId: integer("card_id").notNull(),
	triggerType: varchar("trigger_type", { length: 50 }).notNull(),
	effect: jsonb("effect").notNull(),
	isResolved: boolean("is_resolved").default(false),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});
