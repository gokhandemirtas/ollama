import { conversationSchema, knowledgeSchema } from "../schemas";
import { desc, eq, l2Distance } from "drizzle-orm";

import { db } from "../providers/db.provider";
import getEmbedding from "../providers/embedding.provider";
import { log } from "../providers/logger.provider";

export async function getKnowledge(embedding: Array<number>, category?: string) {
	try {
    let knowledge;
    if (category) {
      knowledge = await db.select().from(knowledgeSchema)
                    .where(eq(knowledgeSchema.metadata, category))
                    .orderBy(l2Distance(knowledgeSchema.embedding, embedding))
                    .limit(1);
    } else {
      knowledge = await db.select().from(knowledgeSchema)
                          .orderBy(l2Distance(knowledgeSchema.embedding, embedding))
                          .limit(1);
    }

		const flattenedKnowledge = knowledge ? knowledge.map((item) => item.content).join("\n") : "No previous knowledge available.";
		return flattenedKnowledge;
	} catch (error) {
		log.error(`[getKnowledge] Knowledge retrieval failed: ${error}`);
		return Promise.reject(error);
	}
}

export async function embedder(userQuery: string) {
	const response = await getEmbedding(userQuery);
	const embedding = response.embedding;

	if (!embedding || !Array.isArray(embedding)) {
		log.error(`[embedder] Embedding invalid`);
		return Promise.reject("Embedding invalid");
	}

	if (embedding && embedding.length !== 768) {
		log.error(`[embedder] Embedding dimensions does not match the schema`);
		return Promise.reject("Embedding dimensions does not match the schema");
	}
  // log.info(`[embedder] Embedding: ${embedding.length} dimensions`);
	return embedding;
}

export async function getChatHistory() {
  try {
    const chatHistory: any = await db.select().from(conversationSchema).where(eq(conversationSchema.role, "user")).orderBy(desc(conversationSchema.timestamp)).limit(500);
    const flattenedChatHistory = chatHistory ? chatHistory.map((item: any) => `[${item?.role}] ${item?.content}`).join("\n") : "No previous conversation available.";
    return flattenedChatHistory
  } catch (error) {
    log.error(`[getChatHistory] Chat history retrieval failed: ${error}`);
    return Promise.reject(error);
  }
}
