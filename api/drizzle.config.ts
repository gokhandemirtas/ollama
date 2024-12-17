import { config } from 'dotenv';

config();

export default {
  schema: "./src/core/schemas/index.ts",
  out: "./src/core/migrations",
  dialect: "postgresql",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
} as const;
