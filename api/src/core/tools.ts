import { ICharacter } from "./models/character";
import { Tool } from "ollama";
import { characterSchema } from "./schemas/character-schema";
import { db } from "./db";

async function saveCharacter(char: ICharacter) {
  try {
    const newCharacter = await db.insert(characterSchema).values({
      ...char,
      createdOn: new Date(),
      userId: 'A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11',
    });
    return Promise.resolve('Character saved successfully');
  } catch (error) {
    return Promise.reject(error);
  }
}

export namespace CustomTools {
  export function picker(name: string): Function {
    switch (name) {
      case 'saveCharacter':
        return saveCharacter;
      default:
        return () => Promise.reject('Tool not found')
    }
  }
  export const SaveCharacter: Tool = {
    type: 'function',
    function: {
        name: 'saveCharacter',
        description: 'Save the character when prompted by the user. Example prompt: "Save this character". Retrieve the details only from the chat history you have with the user.',
        parameters: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: `Character full name`,
            },
            race: {
              type: 'string',
              description: `Character race, (e.g. Human, Elf, etc.)`,
            },
            class: {
              type: 'string',
              description: `Character class, (e.g. Wizard, Fighter, etc.)`,
            },
            alignment: {
              type: 'string',
              description: `Character alignment, (e.g. Lawful Good, Chaotic Neutral, etc.)`,
            },
            abilityScores: {
              type: 'object',
              description: `Character ability scores (e.g. {str: 10, dex: 12, con: 14, int: 16, wis: 18, cha: 20})`,
            },
            level: {
              type: 'object',
              description: `Character level (e.g. {level: 1, experience: 0})`,
            },
            inventory: {
              type: 'string',
              description: `Character inventory, comma seperated strong of weapons and items (e.g. "Sword, Shield, Potion of Healing")`,
            },
            backstory: {
              type: 'string',
              description: `Characters backstory, a brief history of the character, personality traits, beliefs etc.`,
            },
          },
          required: ['name', 'race', 'class', 'alignment', 'abilityScores', 'level', 'inventory', 'backstory'],
        },
    },
  }
}
