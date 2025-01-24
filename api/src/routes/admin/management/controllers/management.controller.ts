import { Metadata } from "../../../../core/models/metadata";
import { conversationSchema } from "../../../../core/schemas";
import { db } from "../../../../core/db";
import getEmbedding from "../../../../core/embedding-provider";
import { knowledgeSchema } from "../../../../core/schemas/knowledge-schema";
import { log } from "../../../../core/logger";
import { sql } from "drizzle-orm";

export async function getTable(name: string) {
	try {
		const results = await db.execute(sql.raw(`SELECT * FROM ${name}`));
		return results;
	} catch (error) {
		log.error(`[getTable:${name}]`, error);
		return error;
	}
}

export async function updateKnowledge({
	content,
	metadatas,
	source,
	category,
}: {
	content: string;
	metadatas: Array<Metadata>;
	source: string;
	category: string;
}) {
	try {
		const response = await getEmbedding(content);
		const embedding = response.embedding;

		const inserted = await db.insert(knowledgeSchema).values({
			metadata: metadatas,
			content,
			source,
			category,
			embedding,
		});
		return Promise.resolve(inserted);
	} catch (error) {
		log.error(`[updateKnowledge]`, error);
		return error;
	}
}

export async function updateChatHistory(role: string, content: string) {
	try {
		if (role && content) {
			await db.insert(conversationSchema).values({
				role,
				content,
				timestamp: new Date(),
				userId: "A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11",
			});
		} else {
			return Promise.reject("Missing role or content");
		}
		return Promise.resolve(true);
	} catch (error) {
		log.error(`[updateChatHistory]`, error);
		return Promise.reject(error);
	}
}
