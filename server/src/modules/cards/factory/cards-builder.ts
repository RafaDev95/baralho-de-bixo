import type { CardAttribute, CardRarity, CardType } from "@/db/schemas";
import type {
	CardAbility,
	CardBase,
	CreatureCard,
	ManaCost,
	AbilityTrigger,
	EffectTarget,
} from "./types";
import { CardFactoryCreator, type CardFactoryData } from "./cards-factory";

export class CardBuilder {
	private cardData: Partial<CardBase> = {};

	setName(name: string): CardBuilder {
		this.cardData.name = name;
		return this;
	}

	setType(type: CardType): CardBuilder {
		this.cardData.type = type;
		return this;
	}

	setRarity(rarity: CardRarity): CardBuilder {
		this.cardData.rarity = rarity;
		return this;
	}

	setAttribute(attribute: CardAttribute): CardBuilder {
		this.cardData.attribute = attribute;
		return this;
	}

	setManaCost(manaCost: ManaCost): CardBuilder {
		this.cardData.manaCost = manaCost;
		return this;
	}

	setDescription(description: string): CardBuilder {
		this.cardData.description = description;
		return this;
	}

	// Creature specific methods
	setPower(power: number): CardBuilder {
		if (this.cardData.type === "creature") {
			(this.cardData as CreatureCard).power = power;
		}
		return this;
	}

	setHealth(health: number): CardBuilder {
		if (this.cardData.type === "creature") {
			(this.cardData as CreatureCard).health = health;
		}
		return this;
	}

	addAbility(ability: CardAbility): CardBuilder {
		if (this.cardData.type === "creature") {
			if (!(this.cardData as CreatureCard).abilities) {
				(this.cardData as CreatureCard).abilities = [];
			}
			(this.cardData as CreatureCard).abilities?.push(ability);
		}
		return this;
	}

	build(): CardBase {
		const factory = CardFactoryCreator.createFactory(
			this.cardData.type ?? "creature",
			this.cardData as CardFactoryData,
		);
		return factory.create();
	}
}

// Example usage with builder:
const flameImp = new CardBuilder()
	.setName("Flame Imp")
	.setType("creature")
	.setRarity("common")
	.setAttribute("fire")
	.setManaCost({ fire: 1, generic: 0 })
	.setDescription("A small but aggressive imp that deals 2 damage when played")
	.setPower(2)
	.setHealth(1)
	.addAbility({
		name: "Quick Strike",
		description: "When played, deal 2 damage to target player",
		trigger: "on_enter_battlefield" as AbilityTrigger,
		effect: {
			type: "damage",
			target: "player" as EffectTarget,
			value: 2,
		},
	})
	.build();
