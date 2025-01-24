import { EmbeddingsResponse } from "ollama";
import axios from "axios";
import { log } from "./logger";

export default async function getEmbedding(prompt: string): Promise<EmbeddingsResponse> {
	const url = `${process.env.LLM_URL!}/api/embeddings`;
	const model = process.env.EMBEDDER_MODEL!;
	log.info(`[getEmbedding] using ${url}`);
	try {
		const payload = { model, prompt };
    // log.info(`[getEmbedding] payload: ${JSON.stringify(payload)}`);
		const embeddingResult = await axios.post(url, payload);
		return embeddingResult.data;
	} catch (error) {
    log.error(`[getEmbedding] error: ${error}`);
		return Promise.reject(error);
	}
}
