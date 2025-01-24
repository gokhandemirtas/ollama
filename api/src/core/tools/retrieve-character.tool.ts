import { Tool } from "ollama";
import { characterSchema } from "../schemas";
import { db } from "../db";
import { log } from "../logger";

export async function retrieveCharacters() {
  try {
    const characters = await db.select().from(characterSchema);
    return Promise.resolve(characters);
  } catch (error) {
    log.error(`[retrieveCharacters] ${error}`);
    return Promise.reject(error);
  }
}

export const RetrieveCharacters: Tool = {
  type: "function",
  function: {
    name: "retrieveCharacters",
    description: "This is a tool to retrieve all characters from the database",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
};
