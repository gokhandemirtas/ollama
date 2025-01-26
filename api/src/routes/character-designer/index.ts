import { Application } from "express";
import { CharacterController } from "./controllers/character.controller";
import { log } from "../../core/providers/logger.provider";
import { metaPromptController } from "./controllers/prompt.controller";

const redis = require('redis');
const expressRedisCache = require('express-redis-cache');
const redisClient = redis.createClient();
const cache = expressRedisCache({ client: redisClient });

export default function characterDesignerRoutes(app: Application) {
  app.post("/character-meta", cache.route(), async (request, reply, next) => {
    try {
      /* const userQuery = request.body.query as string;
      const response = await metaPromptController(userQuery, process.env.LLM_MODEL!); */
      log.info('character-meta');
      reply.type("application/json").status(200).send({
        classes: ["Warrior", "Mage", "Rogue"],
        races: ["Human", "Elf", "Dwarf"],
        alignments: ["Good", "Neutral", "Evil"],
      });
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
