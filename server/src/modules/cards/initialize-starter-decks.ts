import type { CardBase } from "./factory/types";
import { STARTER_DECKS } from "../../lib/starter-decks-definition";

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

			for (const [cardName, count] of Object.entries(
				deckDefinition.cardCounts,
			)) {
				const card = cardPool.find((c) => c.name === cardName);
				if (!card) {
					throw new Error(`Card not found in pool: ${cardName}`);
				}

				for (let i = 0; i < count; i++) {
					deckCards.push(card);
				}
			}

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
