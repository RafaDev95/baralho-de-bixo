import type { CreatureCard } from "@/modules/cards/factory/types";

export const mockCreatureCardDefinition = {
	name: "Flame Imp",
	rarity: "common",
	attribute: "fire",
	description: "A small but aggressive imp",
	manaCost: { fire: 1, generic: 0 },
	type: "creature",
	power: 2,
	health: 1,
	abilities: [
		{
			name: "Quick Strike",
			description: "Deal 2 damage when played",
			trigger: "onSummon",
			effect: {
				type: "damage",
				target: "enemy",
				value: 2,
			},
		},
	],
};

export const mockSpellCardDefinition = {
	name: "Fireball",
	rarity: "common",
	attribute: "fire",
	description: "Deal 3 damage",
	manaCost: { fire: 1, generic: 2 },
	type: "spell",
	effect: {
		type: "damage",
		target: "enemy",
		value: 3,
	},
};

export const mockEnchantmentCardDefinition = {
	name: "Fire Shield",
	rarity: "common",
	attribute: "fire",
	description: "Gain 2 armor",
	manaCost: { fire: 1, generic: 2 },
	type: "enchantment",
	effect: {
		type: "armor",
		target: "self",
		value: 2,
	},
};

export const mockArtifactCardDefinition = {
	name: "Fire Sword",
	rarity: "common",
	attribute: "fire",
	description: "Deal 2 damage",
	manaCost: { fire: 1, generic: 2 },
	type: "artifact",
	effect: {
		type: "damage",
		target: "enemy",
		value: 2,
	},
};

export const mockCardData = {
	cards: [
		mockCreatureCardDefinition,
		mockSpellCardDefinition,
		mockEnchantmentCardDefinition,
		mockArtifactCardDefinition,
	],
};
