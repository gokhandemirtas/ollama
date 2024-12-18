import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config();

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/core/schemas/index.ts",
  out: "./src/core/migrations",
  dbCredentials: {
    host: "localhost",
    port: 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PWD,
    database: "postgres",
    ssl: false
  }
})
