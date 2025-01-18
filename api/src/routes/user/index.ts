import { Application } from "express";
import IConversation from "../../core/models/conversation";
import { User } from "./user-utils";
import { bgBlue } from "ansis";
import { prompter } from "./prompter";

export default function userRoutes(app: Application) {
  app.post("/query", async (request, reply, next) => {
    try {
      const userQuery = request.body.query as string;
      console.log(bgBlue(`Query: ${userQuery}`));
      const response = await prompter(userQuery, process.env.LLM_MODEL!);
      reply.type("application/json").status(200).send(response);
    } catch (error) {
      next(error);
    }
  });

  app.get("/clear-chat-history", async (request, reply, next) => {
    try {
      await User.clearChatHistory();
      reply.type("application/json").status(200).send(true);
    } catch (error) {
      next(error);
    }
  });

  app.get("/conversations", async (request, reply, next) => {
    try {
      const conversations: any = await User.fetchConversations();
      const sorted = conversations.sort((a: IConversation, b: IConversation) => {
        const first = String(a.timestamp).split('.')[0];
        const second = String(b.timestamp).split('.')[0];
        if (first=== second) {
            return a.role === 'user' ? -1 : 1;
        }
        return 0;
      });
      reply.type("application/json").status(200).send(sorted);
    } catch (error) {
      next(error);
    }
  });
}
