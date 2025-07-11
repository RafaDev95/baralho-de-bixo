import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

// Schema definitions
const PlayerSignUpRequestSchema = z.object({
	wallet_address: z.string().min(1, "Wallet address is required"),
	username: z
		.string()
		.min(3, "Username must be at least 3 characters")
		.max(50, "Username too long"),
	email: z.string().email("Invalid email format"),
});

const PlayerSignInRequestSchema = z.object({
	wallet_address: z.string().min(1, "Wallet address is required"),
	signature: z.string().min(1, "Signature is required"),
	digest: z.string().min(1, "Digest is required"),
	encodedMessage: z.string().min(1, "Encoded message is required"),
});

const PlayerResponseSchema = z.object({
	success: z.boolean(),
	message: z.string().optional(),
	player: z
		.object({
			wallet_address: z.string(),
			username: z.string(),
			email: z.string(),
			balance: z.number(),
			rank: z.number(),
			lastLoginAt: z.string().nullable(),
			created_at: z.string(),
		})
		.optional(),
	error: z.string().optional(),
});

// Routes
export const playerSignUp = createRoute({
	method: "post",
	path: "/signup",
	request: {
		body: {
			content: {
				"application/json": {
					schema: PlayerSignUpRequestSchema,
				},
			},
		},
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			PlayerResponseSchema,
			"Player registered successfully",
		),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			PlayerResponseSchema,
			"Invalid request",
		),
		[HttpStatusCodes.CONFLICT]: jsonContent(
			PlayerResponseSchema,
			"Player already exists",
		),
	},
	tags: ["Authentication"],
	summary: "Player sign up",
	description: "Register a new player with wallet address, username, and email",
});

export const playerSignIn = createRoute({
	method: "post",
	path: "/signin",
	request: {
		body: {
			content: {
				"application/json": {
					schema: PlayerSignInRequestSchema,
				},
			},
		},
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			PlayerResponseSchema,
			"Player signed in successfully",
		),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			PlayerResponseSchema,
			"Invalid request",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			PlayerResponseSchema,
			"Invalid signature",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			PlayerResponseSchema,
			"Player not found",
		),
	},
	tags: ["Authentication"],
	summary: "Player sign in",
	description: "Sign in existing player by verifying wallet signature",
});

export const getPlayerProfile = createRoute({
	method: "get",
	path: "/profile/{address}",
	request: {
		params: z.object({
			address: z.string().min(1, "Wallet address is required"),
		}),
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			PlayerResponseSchema,
			"Player profile retrieved",
		),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			PlayerResponseSchema,
			"Invalid address",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			PlayerResponseSchema,
			"Player not found",
		),
	},
	tags: ["Authentication"],
	summary: "Get player profile",
	description: "Retrieve player profile by wallet address",
});
