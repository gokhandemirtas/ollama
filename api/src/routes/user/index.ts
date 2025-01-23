import { Application } from "express";
import IConversation from "../../core/models/conversation";
import { User } from "./user-utils";
import { prompter } from "./prompter";

export default function userRoutes(app: Application) {
  app.post("/query", async (request, reply, next) => {
    try {
      const userQuery = request.body.query as string;
      const response = await prompter(userQuery, process.env.LLM_MODEL!);
      reply.type("application/json").status(200).send(response);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/conversations", async (request, reply, next) => {
    try {
      await User.clearChatHistory();
      reply.type("application/json").status(200).send(true);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/conversation/:id", async (request, reply, next) => {
    try {
      const conversationId = Number(request.params.id);
      await User.deleteConversation(conversationId);
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

  app.get("/characters", async (request, reply, next) => {
    try {
      const characters: any = await User.fetchCharacters();
      reply.type("application/json").status(200).send(characters);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/character/:id", async (request, reply, next) => {
    try {
      const characterId = Number(request.params.id);
      await User.deleteCharacter(characterId);
      reply.type("application/json").status(200).send();
    } catch (error) {
      next(error);
    }
  });
}
