import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/schema.ts',
  out: './drizzle',
  dialect: 'postgresql', // Changed from 'driver' to 'dialect'
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Changed from 'connectionString' to 'url'
  },
} satisfies Config;