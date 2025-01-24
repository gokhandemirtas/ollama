import { ICharacter } from "../models/character";
import { Tool } from "ollama";
import { characterSchema } from "../schemas";
import { db } from "../providers/db.provider";
import { log } from "../providers/logger.provider";
import { parameters } from "./character-params";

export async function saveCharacter(char: ICharacter) {
  try {
    await db.insert(characterSchema).values({
      ...char,
      createdOn: new Date(),
      userId: "A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11",
    });
    return Promise.resolve('Character saved successfully');
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
