import { Application } from "express";
import { CharacterController } from "./controllers/character.controller";
import { MetaController } from "./controllers/meta.controller";
import { assistantPromptController } from "./controllers/prompt.controller";

export default function characterDesignerRoutes(app: Application) {
  app.get("/update-meta", async (request, reply, next) => {
    try {
      await MetaController.updateMeta();
      reply.type("application/json").status(200).send(true);
    } catch (error) {
      next(error);
    }
  });

  app.get("/character-meta", async (request, reply, next) => {
    try {
      const response = await MetaController.fetchMeta();
      reply.type("application/json").status(200).send(response);
    } catch (error) {
      next(error);
    }
  });

  app.post("/assistant", async (request, reply, next) => {
    try {
      const userQuery = request.body.query as string;
      if (userQuery !== '') {
        const response = await assistantPromptController(userQuery, process.env.LLM_MODEL!);
        reply.type("application/json").status(200).send(response);
      } else {
        reply.type("application/json").status(400).send("Empty query");
      }
    } catch (error) {
      next(error);
    }
  });

  app.post("/character", async (request, reply, next) => {
    try {
      const response = await CharacterController.createCharacter(request.body);
      reply.type("application/json").status(200).send(response);
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
