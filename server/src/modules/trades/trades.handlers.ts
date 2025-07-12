import { eq } from "drizzle-orm";
import type { List, Create, GetById, Update, Remove } from "./trades.routes";
import { db } from "../../db/config";
import { tradesTable } from "../../db/schemas/trades";
import type { AppRouteHandler } from "../../lib/types";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

export const list: AppRouteHandler<List> = async (c) => {
	const trades = await db.query.tradesTable.findMany();
	return c.json(trades, HttpStatusCodes.OK);
};

export const create: AppRouteHandler<Create> = async (c) => {
	const body = await c.req.json();
	const [result] = await db.insert(tradesTable).values(body).returning();
	return c.json(result, HttpStatusCodes.CREATED);
};

export const getById: AppRouteHandler<GetById> = async (c) => {
	const params = c.req.valid("param");
	const trade = await db.query.tradesTable.findFirst({
		where: (tradesTable, { eq }) => eq(tradesTable.id, params.id),
	});

	if (!trade) {
		return c.json(
			{ message: HttpStatusPhrases.NOT_FOUND },
			HttpStatusCodes.NOT_FOUND,
		);
	}

	return c.json(trade, HttpStatusCodes.OK);
};

export const update: AppRouteHandler<Update> = async (c) => {
	const params = c.req.valid("param");
	const body = c.req.valid("json");

	const [result] = await db
		.update(tradesTable)
		.set(body)
		.where(eq(tradesTable.id, params.id))
		.returning();

	if (!result) {
		return c.json(
			{ message: HttpStatusPhrases.NOT_FOUND },
			HttpStatusCodes.NOT_FOUND,
		);
	}

	return c.json(result, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<Remove> = async (c) => {
	const { id } = c.req.valid("param");
	const existingTrade = await db
		.select()
		.from(tradesTable)
		.where(eq(tradesTable.id, id))
		.limit(1);

	if (existingTrade.length === 0) {
		return c.json(
			{ message: HttpStatusPhrases.NOT_FOUND },
			HttpStatusCodes.NOT_FOUND,
		);
	}

	await db.delete(tradesTable).where(eq(tradesTable.id, id));
	return c.body(null, HttpStatusCodes.NO_CONTENT);
};
