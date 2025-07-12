import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
	type CardDefinition,
	CardLoader,
} from "@/modules/cards/factory/card-loader";
import type {
	CardEffect,
	ManaCost,
	CreatureCard,
	SpellCard,
	EnchantmentCard,
	ArtifactCard,
} from "@/modules/cards/factory/types";
import type { CardType, CardRarity, CardAttribute } from "@/db/schemas";
import {
	mockArtifactCardDefinition,
	mockCardData,
	mockEnchantmentCardDefinition,
	mockSpellCardDefinition,
} from "../mock/cards";

// pnpm test tests/unit/card.test.ts

// This mock is necessary to test the singleton pattern and the cardloader
// since we don't pass any arguments to the cardloader

// Mock the file system module
vi.mock("node:fs", () => ({
	readFileSync: vi.fn(),
}));

// Mock the path module
vi.mock("node:path", () => ({
	join: vi.fn(),
}));

describe("CardLoader", () => {
	let mockReadFileSync: ReturnType<typeof vi.fn>;
	let mockJoin: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		// Reset all mocks before each test
		vi.clearAllMocks();

		// Get the mocked functions
		mockReadFileSync = vi.mocked(readFileSync);
		mockJoin = vi.mocked(join);

		// Reset the singleton instance
		(CardLoader as unknown as { instance?: CardLoader }).instance = undefined;
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("Singleton Pattern", () => {
		it("should return the same instance when getInstance is called multiple times", () => {
			// Mock successful file loading
			mockJoin.mockReturnValue("/mock/path/card-definitions.json");
			mockReadFileSync.mockReturnValue(JSON.stringify({ cards: [] }));

			const instance1 = CardLoader.getInstance();
			const instance2 = CardLoader.getInstance();

			expect(instance1).toBe(instance2);
		});

		it("should only load card definitions once", () => {
			// Mock successful file loading
			mockJoin.mockReturnValue("/mock/path/card-definitions.json");
			mockReadFileSync.mockReturnValue(JSON.stringify({ cards: [] }));

			// Call getInstance multiple times
			CardLoader.getInstance();
			CardLoader.getInstance();
			CardLoader.getInstance();

			// readFileSync should only be called once
			expect(mockReadFileSync).toHaveBeenCalledTimes(1);
		});
	});

	describe("Card Loading", () => {
		it("should load card definitions from JSON file", () => {
			const mockCardData = {
				cards: [
					{
						name: "Test Creature",
						rarity: "common" as CardRarity,
						attribute: "fire" as CardAttribute,
						description: "A test creature",
						manaCost: { fire: 1, generic: 0 } as ManaCost,
						type: "creature" as CardType,
						power: 2,
						health: 2,
						abilities: [],
						canAttack: true,
						canBlock: true,
						hasSummoningSickness: true,
					},
				],
			};

			mockJoin.mockReturnValue("/mock/path/card-definitions.json");
			mockReadFileSync.mockReturnValue(JSON.stringify(mockCardData));

			const loader = CardLoader.getInstance();
			const cards = loader.loadAllCards();

			expect(mockJoin).toHaveBeenCalledWith(
				expect.any(String),
				"../data/card-definitions.json",
			);
			expect(mockReadFileSync).toHaveBeenCalledWith(
				"/mock/path/card-definitions.json",
				"utf-8",
			);
			expect(cards).toHaveLength(1);
			expect(cards[0].name).toBe("Test Creature");
		});

		it("should throw error when file cannot be read", () => {
			mockJoin.mockReturnValue("/mock/path/card-definitions.json");
			mockReadFileSync.mockImplementation(() => {
				throw new Error("File not found");
			});

			expect(() => CardLoader.getInstance()).toThrow(
				"Failed to load card definitions",
			);
		});

		it("should throw error when JSON is invalid", () => {
			mockJoin.mockReturnValue("/mock/path/card-definitions.json");
			mockReadFileSync.mockReturnValue("invalid json");

			expect(() => CardLoader.getInstance()).toThrow(
				"Failed to load card definitions",
			);
		});
	});

	describe("Card Creation", () => {
		it("should create creature cards correctly", () => {
			mockJoin.mockReturnValue("/mock/path/card-definitions.json");
			mockReadFileSync.mockReturnValue(JSON.stringify(mockCardData));

			const loader = CardLoader.getInstance();
			const cards = loader.loadAllCards();

			const card = cards[0] as CreatureCard;
			expect(card.type).toBe("creature");
			expect(card.name).toBe("Flame Imp");
			expect(card.rarity).toBe("common");
			expect(card.attribute).toBe("fire");
			expect(card.manaCost).toEqual({ fire: 1, generic: 0 });
			expect(card.power).toBe(2);
			expect(card.health).toBe(1);
			expect(card.canAttack).toBe(true);
			expect(card.canBlock).toBe(true);
			expect(card.hasSummoningSickness).toBe(true);
			expect(card.abilities).toHaveLength(1);
		});

		it("should create spell cards correctly", () => {
			const mockCardData = {
				cards: [mockSpellCardDefinition],
			};

			mockJoin.mockReturnValue("/mock/path/card-definitions.json");
			mockReadFileSync.mockReturnValue(JSON.stringify(mockCardData));

			const loader = CardLoader.getInstance();
			const cards = loader.loadAllCards();

			expect(cards).toHaveLength(1);
			const card = cards[0] as SpellCard;
			expect(card.type).toBe("spell");
			expect(card.name).toBe(mockSpellCardDefinition.name);
			expect(card.effect).toEqual({
				type: mockSpellCardDefinition.effect.type,
				target: mockSpellCardDefinition.effect.target,
				value: mockSpellCardDefinition.effect.value,
			});
		});

		it("should create enchantment cards correctly", () => {
			const mockCardData = {
				cards: [mockEnchantmentCardDefinition],
			};

			mockJoin.mockReturnValue("/mock/path/card-definitions.json");
			mockReadFileSync.mockReturnValue(JSON.stringify(mockCardData));

			const loader = CardLoader.getInstance();
			const cards = loader.loadAllCards();

			expect(cards).toHaveLength(1);
			const card = cards[0] as EnchantmentCard;
			expect(card.type).toBe("enchantment");
			expect(card.name).toBe(mockEnchantmentCardDefinition.name);
			expect(card.effect).toEqual({
				type: mockEnchantmentCardDefinition.effect.type,
				target: mockEnchantmentCardDefinition.effect.target,
				value: mockEnchantmentCardDefinition.effect.value,
			});
			expect(card.duration).toBe("permanent");
		});

		it("should create artifact cards correctly", () => {
			const mockCardData = {
				cards: [mockArtifactCardDefinition],
			};

			mockJoin.mockReturnValue("/mock/path/card-definitions.json");
			mockReadFileSync.mockReturnValue(JSON.stringify(mockCardData));

			const loader = CardLoader.getInstance();
			const cards = loader.loadAllCards();

			expect(cards).toHaveLength(1);

			const card = cards[0] as ArtifactCard;
			expect(card.type).toBe("artifact");
			expect(card.name).toBe(mockArtifactCardDefinition.name);
			expect(card.effect).toEqual({
				type: mockArtifactCardDefinition.effect.type,
				target: mockArtifactCardDefinition.effect.target,
				value: mockArtifactCardDefinition.effect.value,
			});
			expect(card.isEquipment).toBe(false);
		});
	});

	describe("Error Handling", () => {
		it("should throw error for creature card without power", () => {
			const mockCardData: { cards: CardDefinition[] } = {
				cards: [
					{
						name: "Invalid Creature",
						rarity: "common" as CardRarity,
						attribute: "fire" as CardAttribute,
						description: "Missing power",
						manaCost: { fire: 1, generic: 0 },
						type: "creature",
						health: 1,
					},
				],
			};

			mockJoin.mockReturnValue("/mock/path/card-definitions.json");
			mockReadFileSync.mockReturnValue(JSON.stringify(mockCardData));

			const loader = CardLoader.getInstance();
			expect(() => loader.loadAllCards()).toThrow(
				"Missing power or health for creature card Invalid Creature",
			);
		});

		it("should throw error for creature card without health", () => {
			const mockCardData: { cards: CardDefinition[] } = {
				cards: [
					{
						name: "Invalid Creature",
						rarity: "common" as CardRarity,
						attribute: "fire" as CardAttribute,
						description: "Missing health",
						manaCost: { fire: 1, generic: 0 },
						type: "creature",
						power: 2,
					},
				],
			};

			mockJoin.mockReturnValue("/mock/path/card-definitions.json");
			mockReadFileSync.mockReturnValue(JSON.stringify(mockCardData));

			const loader = CardLoader.getInstance();
			expect(() => loader.loadAllCards()).toThrow(
				"Missing power or health for creature card Invalid Creature",
			);
		});

		it("should throw error for spell card without effect", () => {
			const mockCardData: { cards: CardDefinition[] } = {
				cards: [
					{
						name: "Invalid Spell",
						rarity: "common" as CardRarity,
						attribute: "fire" as CardAttribute,
						description: "Missing effect",
						manaCost: { fire: 1, generic: 0 },
						type: "spell",
					},
				],
			};

			mockJoin.mockReturnValue("/mock/path/card-definitions.json");
			mockReadFileSync.mockReturnValue(JSON.stringify(mockCardData));

			const loader = CardLoader.getInstance();
			expect(() => loader.loadAllCards()).toThrow(
				"Missing effect for spell card Invalid Spell",
			);
		});

		it("should throw error for enchantment card without effect", () => {
			const mockCardData: { cards: CardDefinition[] } = {
				cards: [
					{
						name: "Invalid Enchantment",
						rarity: "common",
						attribute: "fire",
						description: "Missing effect",
						manaCost: { fire: 1, generic: 0 },
						type: "enchantment",
					},
				],
			};

			mockJoin.mockReturnValue("/mock/path/card-definitions.json");
			mockReadFileSync.mockReturnValue(JSON.stringify(mockCardData));

			const loader = CardLoader.getInstance();
			expect(() => loader.loadAllCards()).toThrow(
				"Missing effect for enchantment card Invalid Enchantment",
			);
		});

		it("should throw error for artifact card without effect", () => {
			const mockCardData: { cards: CardDefinition[] } = {
				cards: [
					{
						name: "Invalid Artifact",
						rarity: "common",
						attribute: "fire",
						description: "Missing effect",
						manaCost: { fire: 1, generic: 0 },
						type: "artifact",
					},
				],
			};

			mockJoin.mockReturnValue("/mock/path/card-definitions.json");
			mockReadFileSync.mockReturnValue(JSON.stringify(mockCardData));

			const loader = CardLoader.getInstance();
			expect(() => loader.loadAllCards()).toThrow(
				"Missing effect for artifact card Invalid Artifact",
			);
		});

		it("should throw error for unsupported card type", () => {
			const mockCardData: { cards: CardDefinition[] } = {
				cards: [
					{
						name: "Invalid Card",
						rarity: "common",
						attribute: "fire",
						description: "Unsupported type",
						manaCost: { fire: 1, generic: 0 },
						type: "invalid_type" as CardType,
					},
				],
			};

			mockJoin.mockReturnValue("/mock/path/card-definitions.json");
			mockReadFileSync.mockReturnValue(JSON.stringify(mockCardData));

			const loader = CardLoader.getInstance();
			expect(() => loader.loadAllCards()).toThrow(
				"Unsupported card type: invalid_type",
			);
		});
	});

	describe("Edge Cases", () => {
		it("should handle empty cards array", () => {
			const mockCardData = { cards: [] };

			mockJoin.mockReturnValue("/mock/path/card-definitions.json");
			mockReadFileSync.mockReturnValue(JSON.stringify(mockCardData));

			const loader = CardLoader.getInstance();
			const cards = loader.loadAllCards();

			expect(cards).toHaveLength(0);
		});

		it("should handle creature cards without abilities", () => {
			const mockCardData: { cards: CardDefinition[] } = {
				cards: [
					{
						name: "Simple Creature",
						rarity: "common",
						attribute: "fire",
						description: "No abilities",
						manaCost: { fire: 1, generic: 0 },
						type: "creature",
						power: 2,
						health: 2,
						abilities: [],
					},
				],
			};

			mockJoin.mockReturnValue("/mock/path/card-definitions.json");
			mockReadFileSync.mockReturnValue(JSON.stringify(mockCardData));

			const loader = CardLoader.getInstance();
			const cards = loader.loadAllCards();

			expect(cards).toHaveLength(1);
			const card = cards[0] as CreatureCard;
			expect(card.abilities).toEqual([]);
		});

		it("should handle artifact cards without equip effect", () => {
			const mockCardData = {
				cards: [
					{
						name: "Simple Artifact",
						rarity: "common" as CardRarity,
						attribute: "fire" as CardAttribute,
						description: "No equip effect",
						manaCost: { fire: 1, generic: 0 } as ManaCost,
						type: "artifact" as CardType,
						effect: {
							type: "damage" as const,
							target: "self" as const,
							value: 1,
						} as CardEffect,
						// No equipEffect
					},
				],
			};

			mockJoin.mockReturnValue("/mock/path/card-definitions.json");
			mockReadFileSync.mockReturnValue(JSON.stringify(mockCardData));

			const loader = CardLoader.getInstance();
			const cards = loader.loadAllCards();

			expect(cards).toHaveLength(1);
			const card = cards[0] as ArtifactCard;
			expect(card.isEquipment).toBe(false);
		});

		it("should handle artifact cards with equip effect", () => {
			const mockCardData: { cards: CardDefinition[] } = {
				cards: [
					{
						name: "Equipment Artifact",
						rarity: "common",
						attribute: "fire",
						description: "With equip effect",
						manaCost: { fire: 1, generic: 0 },
						type: "artifact",
						effect: {
							type: "damage",
							target: "self",
							value: 1,
						},
						equipEffect: {
							power: 2,
							health: 0,
						},
					},
				],
			};

			mockJoin.mockReturnValue("/mock/path/card-definitions.json");
			mockReadFileSync.mockReturnValue(JSON.stringify(mockCardData));

			const loader = CardLoader.getInstance();
			const cards = loader.loadAllCards();

			expect(cards).toHaveLength(1);
			const card = cards[0] as ArtifactCard;
			expect(card.isEquipment).toBe(true);
		});
	});
});
