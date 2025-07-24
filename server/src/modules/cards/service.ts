import { db } from '@/db/config';
import { cardsTable } from '@/db/schemas';
import type { CardDefinition } from './factory/types';

export class CardService {
  async insertMany(cards: CardDefinition[]) {
    const [result] = await db
      .insert(cardsTable)
      .values(cards)
      .onConflictDoNothing()
      .returning();

    console.log('result', result);
    return result;
  }
}
