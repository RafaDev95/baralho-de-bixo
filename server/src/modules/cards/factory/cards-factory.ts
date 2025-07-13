import type { CardType, CardRarity, CardAttribute } from "@/db/schemas";
import type {
	CardBase,
	CreatureCard,
	SpellCard,
	EnchantmentCard,
	ArtifactCard,
	ManaCost,
	CardEffect,
} from "./types";
import {
	CreatureCardStrategy,
	SpellCardStrategy,
	EnchantmentCardStrategy,
	ArtifactCardStrategy,
} from "../strategy/card-creation-strategy";

export type CardFactoryData =
	| Omit<CardBase, "type">
	| Omit<CreatureCard, "type">
	| Omit<SpellCard, "type">
	| Omit<EnchantmentCard, "type">
	| Omit<ArtifactCard, "type">;

export enum CardFactoryType {
	CREATURE = "creature",
	SPELL = "spell",
	ENCHANTMENT = "enchantment",
	ARTIFACT = "artifact",
}

export interface CardFactoryStategy {
	createCard(): CardBase;
	validateCard(card: CardBase): void;
}

// Abstract class for creating cards: Abstract keyword is used to prevent instantiation of the class eg.: new CardFactory() is not allowed
export abstract class CardFactory {
	protected abstract createCard(): CardBase;

	// Template method for card creation: This is a template method pattern. Each subclass MUST implement the create method because it is abstract.
	create(): CardBase {
		const card = this.createCard();
		this.validateCard(card);
		return card;
	}

	protected validateCard(card: CardBase): void {
		if (!card.name) throw new Error("Card must have a name");
		if (!card.type) throw new Error("Card must have a type");
		if (!card.rarity) throw new Error("Card must have a rarity");
		if (!card.attribute) throw new Error("Card must have an attribute");
		if (!card.manaCost) throw new Error("Card must have a mana cost");
	}
}

const strategyRegistry = {
	creature: (cardData: CardFactoryData) =>
		new CreatureCardStrategy(cardData as Omit<CreatureCard, "type">),
	spell: (cardData: CardFactoryData) =>
		new SpellCardStrategy(cardData as Omit<SpellCard, "type">),
	enchantment: (cardData: CardFactoryData) =>
		new EnchantmentCardStrategy(cardData as Omit<EnchantmentCard, "type">),
	artifact: (cardData: CardFactoryData) =>
		new ArtifactCardStrategy(cardData as Omit<ArtifactCard, "type">),
} satisfies Record<CardType, (cardData: CardFactoryData) => CardFactory>;

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class CardFactoryCreator {
	static createFactory(type: CardType, cardData: CardFactoryData): CardFactory {
		const strategyFactory = strategyRegistry[type];

		if (!strategyFactory) {
			throw new Error(`Card type ${type} not supported`);
		}

		return strategyFactory(cardData);
	}
}
