import { conversationSchema, knowledgeSchema } from "../../core/schemas";
import { cosineDistance, desc, eq, l2Distance } from "drizzle-orm";
import { getSystemPrompt, getUserPrompt } from "../../core/prompts";

import { db } from "../../core/db";
import getEmbedding from "../../core/embedding";
import ollama from "ollama";
import { updateChatHistory } from "../admin/management/crud";

export async function prompter(userQuery: string, llmModel: string) {
  try {
    const response = await getEmbedding(userQuery);
    const embedding = response.embedding;

    if (!embedding || !Array.isArray(embedding)) {
      return Promise.reject('Embedding invalid');
    }

    if (embedding && embedding.length !== 768 ) {
      return Promise.reject('Embedding dimensions does not match the schema');
    }

    const knowledge = await db.select().from(knowledgeSchema)
      .orderBy(cosineDistance(knowledgeSchema.embedding, embedding))
      .limit(1);

    const flattenedKnowledge = knowledge ? knowledge.map((item) => item.content).join("\n") : 'No previous knowledge available.';

    const chatHistory: any = await db.select().from(conversationSchema)
      .where(eq(conversationSchema.role, "user"))
      .orderBy(desc(conversationSchema.timestamp))
      .limit(5);

    const flattenedChatHistory = chatHistory ? chatHistory.map((item: any) => `[${item?.role}] ${item?.content}`).join("\n")
      : "No previous conversation available.";

    const userPrompt = getUserPrompt(
      userQuery,
      flattenedKnowledge,
      flattenedChatHistory
    );

    const llamaResponse = await ollama.chat({
      model: llmModel,
      messages: [
        { role: "system", content: getSystemPrompt() },
        { role: "user", content: userPrompt },
        { role: "user", content: `Previous conversation:\n${chatHistory}` },
      ],
    });

    await updateChatHistory("assistant", llamaResponse.message.content);
    await updateChatHistory("user", userQuery ?? "No previous questions.");

    return Promise.resolve(llamaResponse);
  } catch (error) {
    return Promise.reject(error);
  }
}
