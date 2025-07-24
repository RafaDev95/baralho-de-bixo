import { db } from '@/db/config';
import { cardsTable, decksTable } from '@/db/schemas';
import type { AppRouteHandler } from '@/lib/types';
import { eq, inArray } from 'drizzle-orm';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';
import type { Create, GetById, List, Remove, Update } from './decks.routes';

export const list: AppRouteHandler<List> = async (c) => {
  const includeCards = c.req.query('includeCards') === 'true';

  const decks = await db.query.decksTable.findMany({
    with: includeCards
      ? {
          cards: {
            with: {
              card: true,
            },
          },
        }
      : undefined,
  });

  return c.json(decks);
};

export const create: AppRouteHandler<Create> = async (c) => {
  const body = c.req.valid('json');
  console.log('body', body);
  const { cardIds, ...deckData } = body;

  console.log('cardIds', cardIds);

  // Validate that all card IDs exist
  const existingCards = await db
    .select({ id: cardsTable.id })
    .from(cardsTable)
    .where(inArray(cardsTable.id, cardIds));

  console.log('existingCards', existingCards);

  const existingCardIds = existingCards.map((card) => card.id);
  const missingCardIds = cardIds.filter((id) => !existingCardIds.includes(id));

  if (missingCardIds.length > 0) {
    return c.json(
      {
        message: `Cards not found: ${missingCardIds.join(', ')}`,
        missingCardIds,
      },
      HttpStatusCodes.BAD_REQUEST
    );
  }

  const [result] = await db.insert(decksTable).values(deckData).returning();

  // Use a transaction to ensure both deck and deck-cards are created atomically
  // const result = await db.transaction(async (tx) => {
  //   // Create the deck first
  //   const [deck] = await tx.insert(decksTable).values(deckData).returning();

  //   // Create deck-card relationships
  //   const deckCardValues = cardIds.map((cardId) => ({
  //     deckId: deck.id,
  //     cardId,
  //   }));

  //   await tx.insert(deckCards).values(deckCardValues);

  //   // Update the deck's card count
  //   const [updatedDeck] = await tx
  //     .update(decksTable)
  //     .set({ cardCount: cardIds.length })
  //     .where(eq(decksTable.id, deck.id))
  //     .returning();

  //   return updatedDeck;
  // });

  return c.json(result, HttpStatusCodes.CREATED);
};

export const getById: AppRouteHandler<GetById> = async (c) => {
  const params = c.req.valid('param');
  const deck = await db.query.decksTable.findFirst({
    where: (decksTable, { eq }) => eq(decksTable.id, params.id),
    with: {
      cards: {
        with: {
          card: true,
        },
      },
    },
  });

  if (!deck) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(deck, HttpStatusCodes.OK);
};

export const update: AppRouteHandler<Update> = async (c) => {
  const params = c.req.valid('param');
  const body = c.req.valid('json');

  const [result] = await db
    .update(decksTable)
    .set(body)
    .where(eq(decksTable.id, params.id))
    .returning();

  if (!result) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(result, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<Remove> = async (c) => {
  const { id } = c.req.valid('param');
  const existingDeck = await db
    .select()
    .from(decksTable)
    .where(eq(decksTable.id, id))
    .limit(1);

  if (existingDeck.length === 0)
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  await db.delete(decksTable).where(eq(decksTable.id, id));

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
