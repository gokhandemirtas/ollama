import { EmbeddingsResponse } from "ollama";
import ky from "ky";

export default async function getEmbedding(prompt: string): Promise<EmbeddingsResponse> {
	const url = `${process.env.LLAMA_URL!}/api/embeddings`;
	const model = process.env.EMBEDDER_MODEL!;
	console.log(`[Embed] using ${url} with model ${model}`);
	try {
		const payload = { json: { model, prompt } };
		const embeddingResult = await ky.post(url, payload);
		return embeddingResult.json();
	} catch (error) {
		return Promise.reject(error);
	}
}
