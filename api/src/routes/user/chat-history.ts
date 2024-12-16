import { conversationSchema } from "../../core/schemas";
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
}
