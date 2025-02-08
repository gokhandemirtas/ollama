import { embedder, getChatHistory, getKnowledge } from "../../../core/controllers/common.controller";
import { getSystemPrompt, getUserPrompt } from "../../../core/prompt-templates/lore-templates.";
import toolPicker, { RetrieveCharacters, RetrieveSingleCharacter } from "../../../core/tools";

import getLLM from "../../../core/providers/llm.provider";
import { log } from "../../../core/providers/logger.provider";
import timeSpan from 'time-span';
import { updateChatHistory } from "../../admin/management/controllers/management.controller";

export async function promptController(userQuery: string, llmModel: string) {
  const llm = getLLM();

  try {
    await llm.show({ model: llmModel });
  } catch (error) {
    log.error(`[promptController] Error while getting ${llmModel}: ${error}`);
    return Promise.reject(`${llmModel} is not found`);
  }

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

		const initialResponse = await llm.chat({
			model: llmModel,
			messages,
			tools: [RetrieveCharacters, RetrieveSingleCharacter],
		});

    log.info(`[promptController] initialResponse took: ${Number(timer.seconds()).toFixed(2)} secs `);

		const toolCalls = initialResponse.message.tool_calls;

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

		const finalResponse = await llm.chat({
			model: llmModel,
			messages,
		});

    log.info(`[promptController] finalResponse took: ${Number(timer.seconds()).toFixed(2)} secs`);

		await updateChatHistory("assistant", finalResponse.message.content);
		await updateChatHistory("user", userQuery ?? "No previous questions.");

		return Promise.resolve(finalResponse);
	} catch (error) {
		return Promise.reject(error);
	}
}
