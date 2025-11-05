import { dragonHatchling, fireball, fireElemental, flameImp, flameShield, firestormPhoenix, inferno, eternalFlame, flameSword, elementalFusion } from "@/modules/cards/definitions";
import { defineDeck } from "../../deck-builder";


/**
 * Mono Red Aggro starter deck
 */
export const monoRedAggro = defineDeck({
  name: 'Mono Red Aggro',
  colors: ['red'],
  description: 'An aggressive deck focused on dealing quick damage with fire creatures and spells',
  type: 'starter',
  cards: [
    { card: flameImp, count: 4 },
    { card: fireElemental, count: 3 },
    { card: dragonHatchling, count: 3 },
    { card: fireball, count: 4 },
    { card: inferno, count: 2 },
    { card: flameShield, count: 3 },
    { card: firestormPhoenix, count: 2 },
    { card: eternalFlame, count: 2 },
    { card: flameSword, count: 2 },
    { card: elementalFusion, count: 1 },
  ]
});
