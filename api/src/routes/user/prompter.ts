import { getSystemPrompt, getUserPrompt } from "../../core/prompts";

import { db } from "../../core/db";
import getEmbedding from "../../core/embedding";
import ollama from "ollama";

export async function prompter(userQuery: string, model: string) {
  try {
    const response = await getEmbedding(userQuery, model);
    const embedding = response.embedding;

    const knowledge = await db.execute(
      `SELECT id, content, metadata ${embedding} <-> $1 as similarity
      FROM ${process.env.TABLE_KNOWLEDGE!}
      ORDER BY similarity
      LIMIT 30`
    );

    const chatHistory: any = await db.execute(`
      SELECT question, answer, timestamp
      FROM ${process.env.TABLE_CONVERSATIONS!}
      WHERE userId = "aaaa-bbbb-cccc-dddd"
      ORDER BY timestamp DESC
      LIMIT 30
    `);

    const mapped = chatHistory ? chatHistory.map((doc: any) => `[${doc?.metadata?.role}] ${doc?.message?.content}`).join("\n")
      : "No previous conversation available.";

    const userPrompt = getUserPrompt(
      userQuery,
      [knowledge].join("\n"),
      mapped
    );

    const llamaResponse = await ollama.chat({
      model,
      messages: [
        { role: "system", content: getSystemPrompt() },
        { role: "user", content: userPrompt },
        { role: "user", content: `Previous conversation:\n${chatHistory}` },
      ],
    });

    /*
      updateChatHistory("assistant", llamaResponse.message.content);
      updateChatHistory("user", userQuery ?? "No previous questions.");
    */

    return Promise.resolve(llamaResponse);
  } catch (error) {
    return Promise.reject(error);
  }
}
