import { db } from '@/db/config';
import { playersTable } from '@/db/schemas';
import type { AppRouteHandler } from '@/lib/types';
import { eq } from 'drizzle-orm';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';
import type { Create, GetById, List, Remove, Update } from './players.routes';

export const list: AppRouteHandler<List> = async (c) => {
  const players = await db.query.playersTable.findMany();
  return c.json(players);
};

export const create: AppRouteHandler<Create> = async (c) => {
  const body = await c.req.json();
  const [result] = await db.insert(playersTable).values(body).returning();
  return c.json(result, HttpStatusCodes.CREATED);
};

export const getById: AppRouteHandler<GetById> = async (c) => {
  const params = c.req.valid('param');
  const player = await db.query.playersTable.findFirst({
    where: (playersTable, { eq }) => eq(playersTable.id, params.id),
  });

  if (!player) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(player, HttpStatusCodes.OK);
};

export const update: AppRouteHandler<Update> = async (c) => {
  const params = c.req.valid('param');
  const body = c.req.valid('json');

  const [result] = await db
    .update(playersTable)
    .set(body)
    .where(eq(playersTable.id, params.id))
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
  const existingPlayer = await db
    .select()
    .from(playersTable)
    .where(eq(playersTable.id, id))
    .limit(1);

  if (existingPlayer.length === 0)
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  await db.delete(playersTable).where(eq(playersTable.id, id));

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
