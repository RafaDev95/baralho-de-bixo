import type { CardBase } from "./factory/types";
import { STARTER_DECKS } from "./data/starter-decks";

export interface Deck {
	name: string;
	attribute: string;
	description: string;
	cards: CardBase[];
}

export async function initializeStarterDecks(
	cardPool: CardBase[],
): Promise<Deck[]> {
	try {
		const decks: Deck[] = [];

		for (const deckDefinition of STARTER_DECKS) {
			const deckCards: CardBase[] = [];

			// For each card in the deck definition
			for (const [cardName, count] of Object.entries(
				deckDefinition.cardCounts,
			)) {
				// Find the card in the card pool
				const card = cardPool.find((c) => c.name === cardName);
				if (!card) {
					throw new Error(`Card not found in pool: ${cardName}`);
				}

				// Add the card the specified number of times
				for (let i = 0; i < count; i++) {
					deckCards.push(card);
				}
			}

			// Create the deck
			decks.push({
				name: deckDefinition.name,
				attribute: deckDefinition.attribute,
				description: deckDefinition.description,
				cards: deckCards,
			});
		}

		console.log(`Successfully created ${decks.length} starter decks`);
		return decks;
	} catch (error) {
		console.error("Failed to initialize starter decks:", error);
		throw error;
	}
}

// Example usage:
// const cardPool = await initializeCardPool();
// const starterDecks = await initializeStarterDecks(cardPool);
