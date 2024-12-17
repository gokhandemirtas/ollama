import { Metadata } from "../../../core/models/metadata";
import { bgMagenta } from "ansis";
import { db } from "../../../core/db";
import getEmbedding from "../../../core/embedding";
import { knowledgeSchema } from "../../../core/schemas/knowledge-schema";
import { sql } from "drizzle-orm";
import { uniqueId } from "lodash-es";

export async function getCollections() {
  try {
    /* return await chromaClient.listCollections(); */
  } catch (error) {
    return error;
  }
}

export async function deleteCollection(name: string, ) {
  try {
    /* return chromaClient.deleteCollection({
      name
    }) */
  } catch (error) {
    return error;
  }
}

export async function createTable() {
  try {

    return true;
  } catch (error) {
    console.log(`[createTable]`, error);
    return error;
  }
}

export async function getTable(name: string) {
  try {
    const results = await db.execute(
      sql.raw(`SELECT * FROM ${name}`)
    );
    return results;
  } catch (error) {
    console.log(`[getTable:${name}]`, error);
    return error;
  }
}

export async function updateKnowledge(content: string, metadatas: Array<Metadata>) {
  try {
    const response = await getEmbedding(content);
    const embedding = response.embedding;

    const insert = await db.insert(knowledgeSchema).values({
      metadata: JSON.stringify(metadatas),
      content,
      embedding,
    });

    console.log(bgMagenta(`[updateKnowledge] ${content}, ${metadatas}`));
    return Promise.resolve(insert);
  } catch (error) {
    console.log(`[updateKnowledge]`, error);
    return error;
  }
}

export async function updateChatHistory(role: string, content: string, ) {
  try {
    const chatHistoryCollection = await getTable(process.env['CHAT_HISTORY_COLLECTION']!, chromaClient) as any;
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
