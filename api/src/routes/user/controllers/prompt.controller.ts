import { conversationSchema, knowledgeSchema } from "../../../core/schemas";
import { cosineDistance, desc, eq, l2Distance } from "drizzle-orm";
import { getSystemPrompt, getUserPrompt } from "../../../core/prompt-templates.";
import toolPicker, { RetrieveCharacters, SaveCharacter } from "../../../core/tools";

import { db } from "../../../core/db";
import getEmbedding from "../../../core/embedding-provider";
import getLLM from "../../../core/llm-provider";
import { log } from "../../../core/logger";
import timeSpan from 'time-span';
import { updateChatHistory } from "../../admin/management/controllers/management.controller";

async function getKnowledge(embedding: Array<number>) {
	try {
		const knowledge = await db.select().from(knowledgeSchema).orderBy(cosineDistance(knowledgeSchema.embedding, embedding)).limit(1);
		const flattenedKnowledge = knowledge ? knowledge.map((item) => item.content).join("\n") : "No previous knowledge available.";
		return flattenedKnowledge;
	} catch (error) {
		log.error(`[getKnowledge] Knowledge retrieval failed: ${error}`);
		return Promise.reject(error);
	}
}

async function getChatHistory() {
	try {
		const chatHistory: any = await db.select().from(conversationSchema).where(eq(conversationSchema.role, "user")).orderBy(desc(conversationSchema.timestamp)).limit(100);
		const flattenedChatHistory = chatHistory ? chatHistory.map((item: any) => `[${item?.role}] ${item?.content}`).join("\n") : "No previous conversation available.";
		return flattenedChatHistory
	} catch (error) {
		log.error(`[getChatHistory] Chat history retrieval failed: ${error}`);
		return Promise.reject(error);
	}
}

async function embedder(userQuery: string) {
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

export async function promptController(userQuery: string, llmModel: string) {
  const ollama = getLLM();
	try {
    const timer = timeSpan();
		const embedding = await embedder(userQuery);
		const flattenedKnowledge = await getKnowledge(embedding);
		const flattenedChatHistory = await getChatHistory();
		const userPrompt = getUserPrompt(userQuery, flattenedKnowledge, flattenedChatHistory);

		const messages = [
			{ role: "system", content: getSystemPrompt() },
			{ role: "user", content: userPrompt },
			{ role: "user", content: `Previous conversation:\n${flattenedChatHistory}` },
		];

    // log.info(`[promptController] messages: `, JSON.stringify(messages));

		const primaryResponse = await ollama.chat({
			model: llmModel,
			messages,
			tools: [SaveCharacter, RetrieveCharacters/* , CreateCharacter */],
		});

    // log.info(`[promptController] primary response: `, JSON.stringify(primaryResponse));

		const toolCalls = primaryResponse.message.tool_calls;

		toolCalls && log.info(`[Tool] tool calls: `, toolCalls!.length);

		if (toolCalls && toolCalls.length > 0) {
			for (const tool of toolCalls) {
				try {
					const content = await toolPicker(tool.function.name)(tool.function.arguments);
					log.info(`[Tool: ${tool.function.name}], Tool arguments: ${JSON.stringify(tool.function.arguments)}, Tool output: ${content}`);
					messages.push({
						role: "tool",
						content,
					});
				} catch (error) {
					log.error(`[Tool: ${tool.function.name}], Tool error: ${error}`);
				}
			}
		}

		const finalResponse = await ollama.chat({
			model: llmModel,
			messages,
		});

    log.info(`[promptController] Time taken: ${Number(timer.seconds()).toFixed(2)} secs`);

		await updateChatHistory("assistant", finalResponse.message.content);
		await updateChatHistory("user", userQuery ?? "No previous questions.");

		return Promise.resolve(finalResponse);
	} catch (error) {
		return Promise.reject(error);
	}
}
