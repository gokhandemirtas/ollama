import { Application } from "express";
import { CharacterController } from "./controllers/character.controller";
import { ChatController } from "./controllers/chat.controller";
import IConversation from "../../core/models/conversation";
import { promptController } from "./controllers/prompt.controller";

export default function userRoutes(app: Application) {
  app.post("/query", async (request, reply, next) => {
    try {
      const userQuery = request.body.query as string;
      const response = await promptController(userQuery, process.env.LLM_MODEL!);
      reply.type("application/json").status(200).send(response);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/conversations", async (request, reply, next) => {
    try {
      await ChatController.clearChatHistory();
      reply.type("application/json").status(200).send(true);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/conversation/:id", async (request, reply, next) => {
    try {
      const conversationId = Number(request.params.id);
      await ChatController.deleteConversation(conversationId);
      reply.type("application/json").status(200).send(true);
    } catch (error) {
      next(error);
    }
  });

  app.get("/conversations", async (request, reply, next) => {
    try {
      const conversations: any = await ChatController.fetchConversations();
      const sorted = conversations ? conversations.sort((a: IConversation, b: IConversation) => {
        const first = String(a.timestamp).split('.')[0];
        const second = String(b.timestamp).split('.')[0];
        if (first=== second) {
            return a.role === 'user' ? -1 : 1;
        }
        return 0;
      }) : [];
      reply.type("application/json").status(200).send(sorted);
    } catch (error) {
      next(error);
    }
  });

  app.get("/characters", async (request, reply, next) => {
    try {
      const characters: any = await CharacterController.fetchCharacters();
      reply.type("application/json").status(200).send(characters);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/character/:id", async (request, reply, next) => {
    try {
      const characterId = Number(request.params.id);
      await CharacterController.deleteCharacter(characterId);
      reply.type("application/json").status(200).send();
    } catch (error) {
      next(error);
    }
  });
}
