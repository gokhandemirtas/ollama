import { asc, eq } from "drizzle-orm";

import { conversationSchema } from "../../../core/schemas";
import { db } from "../../../core/db";

export namespace ChatController {
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
}
