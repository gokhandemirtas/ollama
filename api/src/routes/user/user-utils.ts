import { asc, desc, eq } from "drizzle-orm";
import { characterSchema, conversationSchema } from "../../core/schemas";

import { db } from "../../core/db";

export namespace User {
  export async function clearChatHistory() {
    try {
      await db.delete(conversationSchema).execute();
      return Promise.resolve(true);
    } catch (error) {
      console.log(`[clearChatHistory]`, error);
      return error;
    }
  }

  export async function deleteConversation(conversationId: number) {
    try {
      await db.delete(conversationSchema)
        .where(eq(conversationSchema.id, conversationId))
      ;
      return Promise.resolve(true);
    } catch (error) {
      console.log(`[deleteConversation]`, error);
      return error;
    }
  }

  export async function fetchConversations() {
    try {
      const conversations = await db.select().from(conversationSchema)
        .orderBy(asc(conversationSchema.timestamp))
      return Promise.resolve(conversations);
    } catch (error) {
      console.log(`[fetchChatHistory]`, error);
      return error;
    }
  }

  export async function fetchCharacters() {
    try {
      const characters = await db.select().from(characterSchema)
      return Promise.resolve(characters);
    } catch (error) {
      console.log(`[fetchCharacters]`, error);
      return error;
    }
  }

  export async function deleteCharacter(characterId: number) {
    try {
      await db.delete(characterSchema)
        .where(eq(characterSchema.id, characterId))
      return Promise.resolve(true);
    } catch (error) {
      console.log(`[deleteCharacter]`, error);
      return error;
    }
  }
}
