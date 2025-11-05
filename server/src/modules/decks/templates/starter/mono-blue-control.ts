import { defineDeck } from '@/modules/decks/deck-builder';
import { 
  waterSprite, 
  tidalGuardian, 
  leviathan, 
  tidalWave, 
  tsunami, 
  waterShield, 
  tidalDragon, 
  oceansBlessing, 
  waterAmulet, 
  masterOfElements 
} from '@/modules/cards/definitions';

/**
 * Mono Blue Control starter deck
 */
export const monoBlueControl = defineDeck({
  name: 'Mono Blue Control',
  colors: ['blue'],
  description: 'A control deck that focuses on managing the board with water creatures and spells',
  type: 'starter',
  cards: [
    { card: waterSprite, count: 4 },
    { card: tidalGuardian, count: 3 },
    { card: leviathan, count: 2 },
    { card: tidalWave, count: 4 },
    { card: tsunami, count: 2 },
    { card: waterShield, count: 3 },
    { card: tidalDragon, count: 2 },
    { card: oceansBlessing, count: 2 },
    { card: waterAmulet, count: 2 },
    { card: masterOfElements, count: 1 },
  ]
});
