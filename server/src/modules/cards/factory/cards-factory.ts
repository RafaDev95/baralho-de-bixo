import { DEFAULT_EFFECT } from "./constants";
import type {
	CreatureCard,
	SpellCard,
	EnchantmentCard,
	ArtifactCard,
	CardDefinition,
	CardEffect,
} from "./types";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class CardFactory {
	private static readonly cardTypeDefinitions = {
		creature: (data: CardDefinition): CreatureCard => {
			const card: CreatureCard = {
				...data,
				type: "creature",
				power: data.power ?? 0,
				health: data.health ?? 1,
				abilities: data.abilities || [],
				canAttack: true,
				canBlock: true,
				hasSummoningSickness: true,
			};

			this.validateCreatureCard(card);
			return card;
		},
		spell: (data: CardDefinition): SpellCard => {
			const card: SpellCard = {
				...data,
				type: "spell",
				effect: data.effect ?? DEFAULT_EFFECT,
			};
			this.validateSpellEnchantmentOrArtifactCard(card);
			return card;
		},
		enchantment: (data: CardDefinition): EnchantmentCard => {
			const card: EnchantmentCard = {
				...data,
				type: "enchantment",
				effect: data.effect ?? DEFAULT_EFFECT,
				duration: data.duration || "permanent",
			};

			this.validateSpellEnchantmentOrArtifactCard(card);
			return card;
		},
		artifact: (data: CardDefinition): ArtifactCard => {
			const card: ArtifactCard = {
				...data,
				type: "artifact",
				effect: data.effect ?? DEFAULT_EFFECT,
				isEquipment: data.isEquipment || false,
			};

			this.validateSpellEnchantmentOrArtifactCard(card);
			return card;
		},
	};

	static createCard(cardData: CardDefinition) {
		const cardDefinition = CardFactory.cardTypeDefinitions[cardData.type];
		if (!cardDefinition) {
			throw new Error(`Card type ${cardData.type} not supported`);
		}
		return cardDefinition(cardData);
	}

	private static validateCreatureCard(card: CreatureCard): void {
		CardFactory.validateBaseCard(card);
		if (card.power < 0) throw new Error("Power cannot be negative");
		if (card.health < 1) throw new Error("Health must be at least 1");
	}

	private static validateSpellEnchantmentOrArtifactCard(
		card: SpellCard | EnchantmentCard | ArtifactCard,
	): void {
		CardFactory.validateBaseCard(card);
		if (!card.effect)
			throw new Error(`Missing effect for spell card ${card.name}`);
	}

	private static validateBaseCard(card: CardDefinition): void {
		if (!card.name) throw new Error("Card must have a name");
		if (!card.type) throw new Error("Card must have a type");
		if (!card.rarity) throw new Error("Card must have a rarity");
		if (!card.attribute) throw new Error("Card must have an attribute");
		if (!card.manaCost) throw new Error("Card must have a mana cost");
	}
}
