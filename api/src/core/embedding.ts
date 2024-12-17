import { EmbeddingsResponse } from 'ollama';
import ky from 'ky';

export default async function getEmbedding(prompt: string, model = process.env.EMBEDDER_MODEL!): Promise<EmbeddingsResponse> {
  return await ky.post(`${process.env.LLAMA_URL!}/api/embeddings`, {
    json: {
      model,
      prompt,
    }
  }).json();
}
