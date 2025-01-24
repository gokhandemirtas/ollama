import { Tool } from "ollama";
import { log } from "../logger";
import { parameters } from "./character-params";

export function createCharacter() {
  try {
    const prompt: string[] = [];
    Object.values(parameters.required).forEach((key, index) => {
      const field = key;
      const desc = (parameters as any).properties[key]?.description || "";
      prompt.push(`Ask the user to provide ${field}, ${desc}`);
    });
    const str = prompt.join("\n");
    log.info(`[createCharacter] ${str}`);
    return str;
  } catch (error) {
    log.error(`[createCharacter] ${error}`);
  }
}

export const CreateCharacter: Tool = {
  type: "function",
  function: {
    name: "createCharacter",
    description: "This is a tool to create a new character",
    parameters
  },
};
