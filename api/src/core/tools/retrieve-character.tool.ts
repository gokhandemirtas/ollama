import { like, or } from "drizzle-orm";

import { Tool } from "ollama";
import { characterSchema } from "../schemas";
import { db } from "../providers/db.provider";
import { log } from "../providers/logger.provider";

export async function retrieveCharacters() {
  try {
    const chars = await db.select().from(characterSchema);
    const flat = [...chars]
      .map((char: any) => `${char.name}, ${char.race}/${char.class}`)
      .join("\n");
    return Promise.resolve(flat);
  } catch (error) {
    log.error(`[retrieveCharacters] ${error}`);
    return Promise.reject(error);
  }
}

export async function retrieveSingleCharacter(desc: string) {
  try {
    const character = await db.select().from(characterSchema)
      .where(
        or(
          like(characterSchema.name, `%${desc}%`),
          like(characterSchema.race, `%${desc}%`),
          like(characterSchema.class, `%${desc}%`)
        )
      )

    log.info(`[retrieveSingleCharacter] ${JSON.stringify(character)}`);
    const flat = Object.keys(character)
      .map((key: any) => `${key}: ${character[key]}`).join("\n");
    return Promise.resolve(flat);
  } catch (error) {
    log.error(`[retrieveSingleCharacter] ${error}`);
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

export const RetrieveSingleCharacter: Tool = {
  type: "function",
  function: {
    name: "retrieveSingleCharacter",
    description: "This is a tool to retrieve a single character from the database",
    parameters: {
      type: "object",
      properties: {
        desc: { type: "string", description: "The id of the character to retrieve, a mix of name,race and class"}
      },
      required: ["desc"],
    },
  },
};
