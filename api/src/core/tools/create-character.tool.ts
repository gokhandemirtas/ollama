import { Tool } from "ollama";
import { characterSchema } from "../schemas";
import { db } from "../providers/db.provider";
import { eq } from "drizzle-orm";
import { log } from "../providers/logger.provider";
import { parameters } from "./character-params";
import { saveCharacter } from "./save-character.tool";

export function getCharacterSurvey() {
  try {
    const prompt: string[] = [];
    const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

    Object.values(parameters.required).forEach((key, index) => {
      const field = key;
      const desc = (parameters as any).properties[key]?.description || "";
      prompt.push(`${alphabet[index]}) What is the character's ${field}, ${desc}`);
    });
    const str = prompt.join("\n");
    log.info(`[getCharacterSurvey]\n ${str}`);
    return str;
  } catch (error) {
    log.error(`[getCharacterSurvey] ${error}`);
  }
}

function getDraft() {
  return db.select()
            .from(characterSchema)
            .where(eq(characterSchema.isDraft, true)).limit(1);
}

export async function createCharacter() {
  const draft = await getDraft();
  if (!!draft) {
    return Promise.resolve("You have a draft character. Would you like to continue?");
  } else {
    await saveCharacter({
      name: '',
      race: '',
      class: '',
      backstory: '',
      alignment: '',
      abilityScores: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
      level: { experience: 0, level: 1 },
      inventory: '',
      isDraft: true,
    });

    return Promise.resolve("Created a draft character. Please fill out the survey to continue.");
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

