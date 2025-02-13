import { like, or } from "drizzle-orm";

import { ICharacter } from "../models/character";
import { Tool } from "ollama";
import { characterSchema } from "../schemas";
import { db } from "../providers/db.provider";
import { log } from "../providers/logger.provider";

function flattenChar(char: ICharacter) {
  return `
    Name: ${char.name}, Race: ${char.race}, Class: ${char.class}, Alignment: ${char.alignment}, Armor Class: ${char.armorClass} \n
    Backstory: ${char.backstory}\n
    Inventory: ${char.inventory}\n
    Proficiencies: ${char.proficiencies}\n
    Ability Scores: ${JSON.stringify(char.abilityScores)} \n
  `;
}

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

export async function retrieveSingleCharacter({desc}: { desc: string}) {
  try {
    const [name, raceClass] = desc.split(", ");
    const [race, charClass] = raceClass.split("/");
    const character = await db.select({
        name: characterSchema.name,
        race: characterSchema.race,
        class: characterSchema.class,
        alignment: characterSchema.alignment,
        backstory: characterSchema.backstory,
        inventory: characterSchema.inventory,
        proficiencies: characterSchema.proficiencies,
        abilityScores: characterSchema.abilityScores,
        armorClass: characterSchema.armorClass,
      })
      .from(characterSchema)
      .where(
        or(
          like(characterSchema.name, `%${name}%`),
          like(characterSchema.race, `%${race}%`),
          like(characterSchema.class, `%${charClass}%`)
        )
      ).limit(1);

    const flat = character ? flattenChar(character[0] as any) : null;
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
