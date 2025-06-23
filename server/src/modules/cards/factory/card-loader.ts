import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CardFactoryCreator, type CardFactoryData } from "./cards-factory";
import type { CardBase, CardAbility, CardEffect, ManaCost } from "./types";
import type { CardType, CardRarity, CardAttribute } from "@/db/schemas";

interface CardDefinition {
	name: string;
	rarity: CardRarity;
	attribute: CardAttribute;
	description: string;
	manaCost: ManaCost;
	type?: CardType;
	power?: number;
	health?: number;
	abilities?: CardAbility[];
	effect?: CardEffect;
	equipEffect?: {
		power: number;
		health: number;
	};
}

interface CardDefinitions {
	cards: CardDefinition[];
}

export class CardLoader {
	private static instance: CardLoader;
	private cardDefinitions: CardDefinition[] = [];
	private nextId = 1;

	private constructor() {
		this.loadCardDefinitions();
	}

	public static getInstance(): CardLoader {
		if (!CardLoader.instance) {
			CardLoader.instance = new CardLoader();
		}
		return CardLoader.instance;
	}

	private loadCardDefinitions(): void {
		try {
			const filePath = join(__dirname, "../data/card-definitions.json");
			const fileContent = readFileSync(filePath, "utf-8");
			const data = JSON.parse(fileContent) as CardDefinitions;
			this.cardDefinitions = data.cards;
		} catch (error) {
			console.error("Error loading card definitions:", error);
			throw new Error("Failed to load card definitions");
		}
	}

	public loadAllCards(): CardBase[] {
		return this.cardDefinitions.map((def) => this.createCard(def));
	}

	private createCard(definition: CardDefinition): CardBase {
		const cardType = definition.type || this.determineCardType(definition);
		const baseCardData = {
			id: this.nextId++,
			name: definition.name,
			rarity: definition.rarity,
			attribute: definition.attribute,
			description: definition.description,
			manaCost: definition.manaCost,
		};

		let cardData: CardFactoryData;
		switch (cardType) {
			case "creature":
				if (!definition.power || !definition.health) {
					throw new Error(
						`Missing power or health for creature card ${definition.name}`,
					);
				}
				cardData = {
					...baseCardData,
					power: definition.power,
					health: definition.health,
					abilities: definition.abilities || [],
					canAttack: true,
					canBlock: true,
					hasSummoningSickness: true,
				};
				break;
			case "spell":
				if (!definition.effect) {
					throw new Error(`Missing effect for spell card ${definition.name}`);
				}
				cardData = {
					...baseCardData,
					effect: definition.effect,
				};
				break;
			case "enchantment":
				if (!definition.effect) {
					throw new Error(
						`Missing effect for enchantment card ${definition.name}`,
					);
				}
				cardData = {
					...baseCardData,
					effect: definition.effect,
					duration: "permanent" as const,
				};
				break;
			case "artifact":
				if (!definition.effect) {
					throw new Error(
						`Missing effect for artifact card ${definition.name}`,
					);
				}
				cardData = {
					...baseCardData,
					effect: definition.effect,
					isEquipment: !!definition.equipEffect,
				};
				break;
			default:
				throw new Error(`Unsupported card type: ${cardType}`);
		}

		const factory = CardFactoryCreator.createFactory(cardType, cardData);
		return factory.create();
	}

	private determineCardType(definition: CardDefinition): CardType {
		if (definition.power !== undefined && definition.health !== undefined) {
			return "creature";
		}
		if (definition.effect) {
			if (definition.equipEffect) {
				return "artifact";
			}
			return "spell";
		}
		throw new Error(`Could not determine card type for ${definition.name}`);
	}
}

// Example usage:
// const cardLoader = CardLoader.getInstance();
// const allCards = cardLoader.loadAllCards();
