import { db } from '@/db/config';
import { decksTable } from '@/db/schemas';
import type { AppRouteHandler } from '@/lib/types';
import { eq } from 'drizzle-orm';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';
import type { Create, GetById, List, Remove, Update } from './decks.routes';

export const list: AppRouteHandler<List> = async (c) => {
  const decks = await db.query.decksTable.findMany();
  return c.json(decks);
};

export const create: AppRouteHandler<Create> = async (c) => {
  const body = await c.req.json();
  const [result] = await db.insert(decksTable).values(body).returning();
  return c.json(result, HttpStatusCodes.CREATED);
};

export const getById: AppRouteHandler<GetById> = async (c) => {
  const params = c.req.valid('param');
  const deck = await db.query.decksTable.findFirst({
    where: (decksTable, { eq }) => eq(decksTable.id, params.id),
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
