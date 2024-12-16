import { getCollectionByName, updateChatHistory } from "./database";
import { getSystemPrompt, getUserPrompt } from "./prompts";

import { ChromaClient } from "chromadb";
import ollama from "ollama";

export async function prompter(userQuery: string, chromaClient: ChromaClient, model = process.env.LLM_MODEL!) {
  try {
    const knowledgeCollection = await getCollectionByName(process.env.KNOWLEDGE_COLLECTION!, chromaClient);
    const knowledge = await (knowledgeCollection as any).query({
      queryTexts: [userQuery],
      nResults: 30,
    });

    const chatHistoryCollection = await getCollectionByName(process.env.CHAT_HISTORY_COLLECTION!, chromaClient);
    const chatHistoryResponse = await (chatHistoryCollection as any).peek({
      limit: 50,
    });
    const chatHistory = chatHistoryResponse.documents && Array.isArray(chatHistoryResponse.documents)
      ? chatHistoryResponse.documents.map((doc: any) => `[${doc?.metadata?.role}] ${doc?.message?.content}`).join("\n")
      : "No previous conversation available.";

    const userPrompt = getUserPrompt(
      userQuery,
      (knowledge.documents as any[]).map(doc => doc.message?.content || "").join("\n"),
      chatHistory
    );

    const llamaResponse = await ollama.chat({
      model,
      messages: [
        { role: "system", content: getSystemPrompt() },
        { role: "user", content: userPrompt },
        { role: "user", content: `Previous conversation:\n${chatHistory}` },
      ],
    });

    updateChatHistory("assistant", llamaResponse.message.content, chromaClient);
    updateChatHistory("user", userQuery ?? "No previous questions.", chromaClient);

    return Promise.resolve(llamaResponse);
  } catch (error) {
    return Promise.reject(error);
  }
}
