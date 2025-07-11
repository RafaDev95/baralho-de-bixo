import { createRoute } from "@hono/zod-openapi";
import { playersSchema, insertPlayerSchema } from "@/db/schemas";
import { jsonContent } from "stoker/openapi/helpers";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";
import { notFoundSchema } from "@/lib/constants";
import { createGenericPatchRoute, createGenericPostRoute } from "../handlers";

const tags = ["Players"];

export const list = createRoute({
	tags,
	path: "/players",
	method: "get",
	responses: {
		[HttpStatusCodes.OK]: jsonContent(playersSchema.array(), `${tags[0]} List`),
	},
});

export const create = createGenericPostRoute({
	path: "/players",
	insertSchema: insertPlayerSchema,
	responseSchema: playersSchema,
	description: "Create a player",
	tag: tags[0],
});

export const getById = createRoute({
	tags,
	path: "/players/{id}",
	request: { params: IdParamsSchema },
	method: "get",
	responses: {
		[HttpStatusCodes.OK]: jsonContent(playersSchema, "Requested player"),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Not found"),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
			createErrorSchema(IdParamsSchema),
			"Invalid Id Error",
		),
	},
});

export const update = createGenericPatchRoute({
	tag: tags[0],
	path: "/players/{id}",
	responseSchema: playersSchema,
	updateSchema: insertPlayerSchema.partial(),
});

export const remove = createRoute({
	path: "/players/{id}",
	method: "delete",
	request: {
		params: IdParamsSchema,
	},
	tags,
	responses: {
		[HttpStatusCodes.NO_CONTENT]: {
			description: "Player deleted",
		},
		[HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Not found"),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
			createErrorSchema(IdParamsSchema),
			"Invalid id error",
		),
	},
});

export type List = typeof list;
export type GetById = typeof getById;
export type Create = typeof create;
export type Update = typeof update;
export type Remove = typeof remove;
