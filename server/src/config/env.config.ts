import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  PORT: z.string().default('5000').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  API_PREFIX: z.string().default('/api/v1'),
  CORS_ORIGIN: z.string().default('*'),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/invictus_db?schema=public'),
  JWT_ACCESS_SECRET: z.string().default('invictus_super_secret_jwt_access_key_2026_sih'),
  JWT_REFRESH_SECRET: z.string().default('invictus_super_secret_jwt_refresh_key_2026_sih'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  AI_PROVIDER: z.string().default('mock'),
  AI_API_KEY: z.string().default('mock_key'),
  AI_MODEL: z.string().default('gemini-1.5-pro'),
  STORAGE_PROVIDER: z.string().default('mock'),
  STORAGE_BUCKET: z.string().default('invictus-uploads')
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format());
  throw new Error('Invalid environment configuration');
}

export const env = parsedEnv.data;
