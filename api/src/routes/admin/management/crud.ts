import { Metadata } from "../../../core/models/metadata";
import { bgMagenta } from "ansis";
import { conversationSchema } from "../../../core/schemas";
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
      metadata: metadatas,
      content,
      embedding,
    });

    console.log(bgMagenta(`[updateKnowledge] success`));
    return Promise.resolve(insert);
  } catch (error) {
    console.log(`[updateKnowledge]`, error);
    return error;
  }
}

export async function updateChatHistory(role: string, content: string, ) {
  try {
    if (role && content) {
      await db.insert(conversationSchema).values({
        role,
        question: role === 'user' ? content : 'something',
        answer: role === 'assistant' ? content : 'anything',
        timestamp: new Date().toISOString(),
        userId: 'A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11',
      })
    } else {
      return Promise.reject('Missing role or content');
    }
    return Promise.resolve(true);
  } catch (error) {
    console.log(`[updateChatHistory]`, error);
    return Promise.reject(error);
  }
}
