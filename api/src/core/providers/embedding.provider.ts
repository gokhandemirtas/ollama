import { EmbeddingsResponse } from "ollama";
import ky from "ky";
import { log } from "./logger.provider";

export default async function getEmbedding(prompt: string): Promise<EmbeddingsResponse> {
	const url = `${process.env.LLM_URL!}/api/embeddings`;
	const model = process.env.EMBEDDER_MODEL!;
	log.info(`[getEmbedding] using ${url}, ${model}`);
	try {
		const payload = { model, prompt };
		const embeddingResult = await ky.post(url, { json: payload, timeout: 60 * 1000 });
		return embeddingResult.json();
	} catch (error) {
    log.error(`[getEmbedding] error: ${error}`);
		return Promise.reject(error);
	}
}
