import { ICharacter } from "../models/character";
import { Tool } from "ollama";
import { characterSchema } from "../schemas";
import { db } from "../providers/db.provider";
import { eq } from "drizzle-orm";
import { log } from "../providers/logger.provider";
import { parameters } from "./character-params";

async function checkIfExists(char: ICharacter) {
  try {
    if (char.name) {
      const existing = await db.select().from(characterSchema).where(eq(characterSchema.name, char.name)).limit(1);
      return Promise.resolve(!!existing);
    }
  } catch (error) {
    log.error(`[checkIfExists] ${error}`);
    return Promise.reject(error);
  }
}

export async function saveCharacter(char: ICharacter) {
  try {
    const doesExist = await checkIfExists(char);
    if (doesExist === false) {
      await db.insert(characterSchema).values({
        ...char,
        createdOn: new Date(),
        userId: "A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11",
      });
      return Promise.resolve('Character saved successfully');
    } else {
      return Promise.resolve('Character already exists');
    }

  } catch (error) {
    log.error(`[saveCharacter] ${error}`);
    return Promise.reject(error);
  }
}

export const SaveCharacter: Tool = {
  type: "function",
  function: {
    name: "saveCharacter",
    description: "This tool will only be called when user asks to save a character",
    parameters
  },
};
