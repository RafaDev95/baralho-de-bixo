import "dotenv/config";

import { z, ZodError } from "zod";

const envSchema = z.object({
	DATABASE_HOST: z.string().min(1),
	DATABASE_NAME: z.string().min(1),
	DATABASE_USERNAME: z.string().min(1),
	DATABASE_PASSWORD: z.string().min(1),
	DATABASE_PORT: z.coerce.number().min(1),
	DATABASE_URL: z.string().min(1),
	PORT: z.coerce.number().default(3001),
	LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]),
	NODE_ENV: z.string().default("development"),
	TEST_MODE: z.coerce.boolean().default(true),
	// DATABASE_AUTH_TOKEN: z.string().optional(),
});
// .superRefine((input, ctx) => {
//   if (input.NODE_ENV === 'production' && !input.DATABASE_AUTH_TOKEN) {
//     ctx.addIssue({
//       code: z.ZodIssueCode.invalid_type,
//       expected: 'string',
//       received: 'undefined',
//       path: ['DATABASE_AUTH_TOKEN'],
//       message: "Must be set when NODE_ENV is 'production'",
//     })
//   }
// })

try {
	envSchema.parse(process.env);
} catch (e) {
	if (e instanceof ZodError) {
		console.error("Environment validation error:", e.flatten().fieldErrors);
		process.exit(1);
	}
}

export const env = envSchema.parse(process.env);
