import { embedder, getKnowledge } from "../../../core/controllers/common.controller";
import { getSystemPrompt, getUserPrompt } from "../../../core/prompt-templates/character-creation-template";

import getLLM from "../../../core/providers/llm.provider";
import { log } from "../../../core/providers/logger.provider";
import timeSpan from "time-span";

export async function assistantPromptController(userQuery: string, llmModel: string) {
  const llm = getLLM();

  try {
    await llm.show({ model: llmModel });
  } catch (error) {
    log.error(`[assistantPromptController] Error while getting ${llmModel}: ${error}`);
    return Promise.reject(`${llmModel} is not found`);
  }

  log.info(`[assistantPromptController] started preparing response with ${llmModel}`);

	try {
    const timer = timeSpan();
		const embedding = await embedder(userQuery);
		const flattenedKnowledge = await getKnowledge(embedding, null, 1);
		const userPrompt = getUserPrompt(userQuery, flattenedKnowledge);

		const messages = [
			{ role: "system", content: getSystemPrompt() },
			{ role: "user", content: userPrompt },
		];

		const response = await llm.chat({
			model: llmModel,
			messages,
		});

    log.info(`[assistantPromptController] response took: ${Number(timer.seconds()).toFixed(2)} secs `);

		return Promise.resolve(response);
	} catch (error) {
		return Promise.reject(error);
	}
}
