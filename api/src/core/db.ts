import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import { log } from "./logger";

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);

const testDb = async () => {
	const result = await db.execute(sql`select * from knowledge`);
	if (!result) {
		log.error("Failed to connect db.");
		return;
	}
	log.info("[API] Database connection test successful");
};

testDb();
