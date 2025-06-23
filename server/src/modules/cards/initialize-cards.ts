import { CardLoader } from "./factory/card-loader";
import type { CardBase } from "./factory/types";

export async function initializeCardPool(): Promise<CardBase[]> {
	try {
		const cardLoader = CardLoader.getInstance();
		const allCards = cardLoader.loadAllCards();

		// Here you would typically save these cards to your database
		// For example:
		// await db.insert(cardsTable).values(allCards);

		console.log(`Successfully loaded ${allCards.length} cards`);
		return allCards;
	} catch (error) {
		console.error("Failed to initialize card pool:", error);
		throw error;
	}
}

// Example usage:
// This would typically be called during your application startup
// or as part of a database migration
// await initializeCardPool();
