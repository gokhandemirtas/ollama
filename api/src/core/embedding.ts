import { EmbeddingsResponse } from 'ollama';
import ky from 'ky';

export default async function getEmbedding(prompt: string): Promise<EmbeddingsResponse> {
  return await ky.post(`${process.env.LLAMA_URL!}/api/embeddings`, {
    json: {
      model: process.env.EMBEDDER_MODEL!,
      prompt,
    }
  }).json();
}
