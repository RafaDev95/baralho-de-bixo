import { db } from '@/db/config';
import { cardsTable } from '@/db/schemas';
import type { AppRouteHandler } from '@/lib/types';
import { eq } from 'drizzle-orm';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';
import type { Create, GetById, List, Remove, Update } from './cards.routes';

export const list: AppRouteHandler<List> = async (c) => {
  const cards = await db.query.cardsTable.findMany();
  return c.json(cards);
};

export const create: AppRouteHandler<Create> = async (c) => {
  const body = await c.req.json();
  const [result] = await db.insert(cardsTable).values(body).returning();
  return c.json(result, HttpStatusCodes.CREATED);
};

export const getById: AppRouteHandler<GetById> = async (c) => {
  const params = c.req.valid('param');
  const card = await db.query.cardsTable.findFirst({
    where: (cardsTable, { eq }) => eq(cardsTable.id, params.id),
  });

  if (!card) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(card, HttpStatusCodes.OK);
};

export const update: AppRouteHandler<Update> = async (c) => {
  const params = c.req.valid('param');
  const body = c.req.valid('json');

  const [result] = await db
    .update(cardsTable)
    .set(body)
    .where(eq(cardsTable.id, params.id))
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
  const existingCard = await db
    .select()
    .from(cardsTable)
    .where(eq(cardsTable.id, id))
    .limit(1);

  if (existingCard.length === 0)
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  await db.delete(cardsTable).where(eq(cardsTable.id, id));

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
