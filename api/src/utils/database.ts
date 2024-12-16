import { ChromaClient, Metadata, OllamaEmbeddingFunction } from "chromadb";

import { bgMagenta } from "ansis";
import { uniqueId } from "lodash-es";

export const embeddingFunction = new OllamaEmbeddingFunction({
  url: `${process.env.LLAMA_URL!}/api/embeddings`,
  model: process.env.EMBEDDER_MODEL!
});

export async function getCollections(chromaClient: ChromaClient) {
  try {
    return await chromaClient.listCollections();
  } catch (error) {
    return error;
  }
}

export async function deleteCollection(name: string, chromaClient: ChromaClient) {
  try {
    return chromaClient.deleteCollection({
      name
    })
  } catch (error) {
    return error;
  }
}

export async function createCollections(chromaClient: ChromaClient) {
  try {
    await chromaClient.getOrCreateCollection({
      name: process.env.CHAT_HISTORY_COLLECTION!,
      embeddingFunction
    });
    await chromaClient.getOrCreateCollection({
      name: process.env.KNOWLEDGE_COLLECTION!,
      embeddingFunction
    });
    return true;
  } catch (error) {
    console.log(`[createCollections]`, error);
    return error;
  }
}

export async function getCollectionByName(name: string, chromaClient: ChromaClient) {
  try {
    return chromaClient.getCollection({
      name,
      embeddingFunction
    });
  } catch (error) {
    console.log(`[getCollectionByName:${name}]`, error);
    return error;
  }
}

export async function updateKnowledge(content: string, metadatas: Array<Metadata>, chromaClient: ChromaClient) {
  try {
    const knowledgeCollection = await getCollectionByName(process.env['KNOWLEDGE_COLLECTION']!, chromaClient) as any;
    knowledgeCollection.upsert({
      documents: [content],
      ids: [uniqueId('llm')],
      metadatas
    });
    console.log(bgMagenta(`[updateKnowledge] ${content}, ${metadatas}`));
    return Promise.resolve(true);
  } catch (error) {
    console.log(`[updateKnowledge]`, error);
    return error;
  }
}

export async function updateChatHistory(role: string, content: string, chromaClient: ChromaClient) {
  try {
    const chatHistoryCollection = await getCollectionByName(process.env['CHAT_HISTORY_COLLECTION']!, chromaClient) as any;
    if (role && content) {
      chatHistoryCollection.upsert({
        documents: [content],
        ids: [uniqueId(role)],
        metadatas: [{ role, timestamp: new Date().toISOString() }],
      });
    }
    return Promise.resolve(true);
  } catch (error) {
    console.log(`[updateChatHistory]`, error);
    return error;
  }
}
