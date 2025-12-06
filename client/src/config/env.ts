import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:3001'),
  NEXT_PUBLIC_WS_URL: z.string().url().default('ws://localhost:8081'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

function getEnv() {
  try {
    return envSchema.parse({
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
      NODE_ENV: process.env.NODE_ENV,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Environment validation error:', error.flatten().fieldErrors);
      throw new Error('Invalid environment variables');
    }
    throw error;
  }
}

export const env = getEnv();

