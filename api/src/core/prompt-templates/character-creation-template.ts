import { getCharacterSurvey } from "../tools";

export function getSystemPrompt(topic = 'Dungeons and Dragons') {
  return `
    Comment on name, use witticisms. Check if the name is a fitting choice for the race user picked.
    ---
    Comment on race, class, alignment combination. Let the user e.g. an elf can not be a barbarian
    ---
    You will roll for ability scores when asked, make sure the ability scores are compatible with the game system: ${topic},
    and suitable for chosen race and class. Return the results as a parsable JSON object that follows the format:
    {str: 10, dex: 12, con: 14, int: 16, wis: 18, cha: 20}, do not make any other comments and only return a JSON object.
    ---
    You will write a backstory when asked, make sure the backstory is suitable for the race, class, alignment and beliefs. If user provides a brief history, you will expand on it.
    ---
    You will recommend weapons and items, suitable for race and class.
    ---
    You will also recommend spells, if the character is a spellcaster.
  `
}

export function getUserPrompt(question: string, knowledge: string) {
  return `
    Below is the knowledge base you can use to answer the question:
    ---
    ${knowledge}
    ---
    Based on the above, please answer the following question:
    "${question}"
    ---
    Return your answer in markdown format.
  `;
}
