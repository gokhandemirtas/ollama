import { embedder, getKnowledge } from "../../../core/controllers/common.controller";
import { getSystemPrompt, getUserPrompt } from "../../../core/prompt-templates/character-creation-template";

import getLLM from "../../../core/providers/llm.provider";
import { log } from "../../../core/providers/logger.provider";
import timeSpan from "time-span";

export async function characterDesignerPromptController(userQuery: string, llmModel: string) {
  const llm = getLLM();

  try {
    await llm.show({ model: llmModel });
  } catch (error) {
    log.error(`[characterDesignerPromptController] Error while getting ${llmModel}: ${error}`);
    return Promise.reject(`${llmModel} is not found`);
  }

	try {
    const timer = timeSpan();
		const embedding = await embedder(userQuery);
		const flattenedKnowledge = await getKnowledge(embedding);
		const userPrompt = getUserPrompt(userQuery, flattenedKnowledge);

		const messages = [
			{ role: "system", content: getSystemPrompt() },
			{ role: "user", content: userPrompt },
		];

		const response = await llm.chat({
			model: llmModel,
			messages,
		});

    log.info(`[characterDesignerPromptController] response took: ${Number(timer.seconds()).toFixed(2)} secs `);

		return Promise.resolve(response);
	} catch (error) {
		return Promise.reject(error);
	}
}

export async function metaPromptController(userQuery: string = "Get character metadata", llmModel: string) {
  const llm = getLLM();

  try {
    await llm.show({ model: llmModel });
  } catch (error) {
    log.error(`[characterDesignerPromptController] Error while getting ${llmModel}: ${error}`);
    return Promise.reject(`${llmModel} is not found`);
  }

	try {
    const timer = timeSpan();
		const embedding = await embedder(userQuery);
		const flattenedKnowledge = await getKnowledge(embedding, 'create');
		const userPrompt = getUserPrompt(userQuery, flattenedKnowledge);

		const messages = [
			{ role: "system", content: `When asked for character meta, you will return a JSON object that consists of seperate array of races, classes, aligntments.
          Only return a JSON in the response, nothing else. Example: { classes: [], races: [], alignments: [] }`},
			{ role: "user", content: userPrompt },
		];

		const response = await llm.chat({
			model: llmModel,
			messages,
		});

    log.info(`[characterDesignerPromptController] response took: ${Number(timer.seconds()).toFixed(2)} secs `);

		return Promise.resolve(response);
	} catch (error) {
		return Promise.reject(error);
	}
}
