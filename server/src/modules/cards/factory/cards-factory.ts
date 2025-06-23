import type { CardType } from "@/db/schemas";
import type {
	CardBase,
	CreatureCard,
	SpellCard,
	EnchantmentCard,
	ArtifactCard,
} from "./types";

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

export class CreatureCardFactory extends CardFactory {
	constructor(private readonly cardData: Omit<CreatureCard, "type">) {
		super();
	}

	protected createCard(): CreatureCard {
		return {
			...this.cardData,
			type: "creature",
			canAttack: true,
			canBlock: true,
			hasSummoningSickness: true,
			abilities: this.cardData.abilities || [],
		};
	}

	protected validateCard(card: CreatureCard): void {
		super.validateCard(card);
		if (card.power < 0) throw new Error("Power cannot be negative");
		if (card.health < 1) throw new Error("Health must be at least 1");
	}
}

export class SpellCardFactory extends CardFactory {
	constructor(private readonly cardData: Omit<SpellCard, "type">) {
		super();
	}

	protected createCard(): SpellCard {
		return {
			...this.cardData,
			type: "spell",
		};
	}

	protected validateCard(card: SpellCard): void {
		super.validateCard(card);
		if (!card.effect) throw new Error("Spell must have an effect");
	}
}

export class EnchantmentCardFactory extends CardFactory {
	constructor(private readonly cardData: Omit<EnchantmentCard, "type">) {
		super();
	}

	protected createCard(): EnchantmentCard {
		return {
			...this.cardData,
			type: "enchantment",
		};
	}

	protected validateCard(card: EnchantmentCard): void {
		super.validateCard(card);
		if (!card.effect) throw new Error("Enchantment must have an effect");
	}
}

export class ArtifactCardFactory extends CardFactory {
	constructor(private readonly cardData: Omit<ArtifactCard, "type">) {
		super();
	}

	protected createCard(): ArtifactCard {
		return {
			...this.cardData,
			type: "artifact",
		};
	}

	protected validateCard(card: ArtifactCard): void {
		super.validateCard(card);
		if (!card.effect) throw new Error("Artifact must have an effect");
	}
}

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class CardFactoryCreator {
	static createFactory(type: CardType, cardData: CardFactoryData): CardFactory {
		switch (type) {
			case CardFactoryType.CREATURE:
				return new CreatureCardFactory(cardData as Omit<CreatureCard, "type">);
			case CardFactoryType.SPELL:
				return new SpellCardFactory(cardData as Omit<SpellCard, "type">);
			case CardFactoryType.ENCHANTMENT:
				return new EnchantmentCardFactory(
					cardData as Omit<EnchantmentCard, "type">,
				);
			case CardFactoryType.ARTIFACT:
				return new ArtifactCardFactory(cardData as Omit<ArtifactCard, "type">);
			default:
				throw new Error(`Card type ${type} not supported`);
		}
	}
}

// Example usage:
const flameImpData = {
	name: "Flame Imp",
	rarity: "common",
	attribute: "fire",
	description: "A small but aggressive imp that deals 2 damage when played",
	manaCost: { fire: 1, generic: 0 },
	power: 2,
	health: 1,
	abilities: [
		{
			name: "Quick Strike",
			description: "When played, deal 2 damage to target player",
			trigger: "on_enter_battlefield",
			effect: {
				type: "damage",
				target: "player",
				value: 2,
			},
		},
	],
};

// const flameImpFactory = CardFactoryCreator.createFactory(
// 	"creature",
// 	flameImpData,
// );
// const flameImp = flameImpFactory.create();
