import type { CardAttribute, CardRarity, CardType } from "@/db/schemas";

export type EffectTarget = "self" | "enemy" | "all" | "random";
export type EffectCondition = "if" | "unless";
export type EffectDuration = "instant" | "permanent" | "turn" | "round";
export type AbilityTrigger =
	| "onSummon"
	| "onAttack"
	| "onBlock"
	| "onDamage"
	| "onHeal"
	| "onDraw"
	| "onDiscard"
	| "onSummon"
	| "onAttack"
	| "onBlock"
	| "onDamage"
	| "onHeal"
	| "onDraw"
	| "onDiscard";

export type EffectType =
	| "damage"
	| "heal"
	| "draw"
	| "discard"
	| "summon"
	| "block"
	| "attack";

export interface CardBase {
	id: number;
	name: string;
	type: CardType;
	rarity: CardRarity;
	attribute: CardAttribute;
	description: string;
	manaCost: ManaCost;
}

export interface CreatureCard extends CardBase {
	type: "creature";
	power: number;
	health: number;
	abilities?: CardAbility[];
	canAttack: boolean;
	canBlock: boolean;
	hasSummoningSickness: boolean;
}

export interface SpellCard extends CardBase {
	type: "spell";
	effect: CardEffect;
}

export interface EnchantmentCard extends CardBase {
	type: "enchantment";
	effect: CardEffect;
	duration: EffectDuration;
}

export interface ArtifactCard extends CardBase {
	type: "artifact";
	effect: CardEffect;
	isEquipment: boolean;
}

export interface ManaCost {
	fire?: number;
	water?: number;
	wind?: number;
	generic: number;
}

export interface CardEffect {
	type: EffectType;
	target: EffectTarget;
	value: number;
	condition?: EffectCondition;
}

export interface CardAbility {
	name: string;
	description: string;
	trigger: AbilityTrigger;
	effect: CardEffect;
}
