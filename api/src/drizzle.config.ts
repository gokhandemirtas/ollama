import { config } from 'dotenv';

config();

export default {
  schema: "./src/core/schema.ts",
  out: "./src/core/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
};
