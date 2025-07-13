import { CardFactory } from "../factory/cards-factory";
import type {
	ArtifactCard,
	CreatureCard,
	EnchantmentCard,
	SpellCard,
} from "../factory/types";

export class CreatureCardStrategy extends CardFactory {
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
		if (!card.power || !card.health) {
			throw new Error(`Missing power or health for creature card ${card.name}`);
		}
	}
}

export class SpellCardStrategy extends CardFactory {
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
		if (!card.effect)
			throw new Error(`Missing effect for spell card ${card.name}`);
	}
}

export class EnchantmentCardStrategy extends CardFactory {
	constructor(private readonly cardData: Omit<EnchantmentCard, "type">) {
		super();
	}

	protected createCard(): EnchantmentCard {
		return {
			...this.cardData,
			type: "enchantment",
			duration: this.cardData.duration || "permanent",
		};
	}

	protected validateCard(card: EnchantmentCard): void {
		super.validateCard(card);
		if (!card.effect)
			throw new Error(`Missing effect for enchantment card ${card.name}`);
	}
}

export class ArtifactCardStrategy extends CardFactory {
	constructor(private readonly cardData: Omit<ArtifactCard, "type">) {
		super();
	}

	protected createCard(): ArtifactCard {
		return {
			...this.cardData,
			type: "artifact",
			isEquipment: this.cardData.isEquipment || false,
		};
	}

	protected validateCard(card: ArtifactCard): void {
		super.validateCard(card);
		if (!card.effect)
			throw new Error(`Missing effect for artifact card ${card.name}`);
	}
}
