import type { CardRarity, CardType } from "@/db/schemas";
import type { Card } from "../factory/types";

class CardBuilder {
	private card: Partial<Card> = {};

	setName(name: string): CardBuilder {
		this.card.name = name;
		return this;
	}

	setType(type: CardType): CardBuilder {
		this.card.type = type;
		return this;
	}

	setRarity(rarity: CardRarity): CardBuilder {
		this.card.rarity = rarity;
		return this;
	}

	build(): Card {
		// Validate required properties
		if (!this.card.name || !this.card.type || !this.card.rarity) {
			throw new Error("Missing required card properties");
		}
		return this.card as Card;
	}
}
