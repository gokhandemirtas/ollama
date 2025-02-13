import { ABILITY_ROLL_EXAMPLE, ANALYSIS_EXAMPLE, BACKGROUND_EXAMPLE, INVENTORY_EXAMPLE, NAME_EXAMPLE, PROFICIENCIES_EXAMPLE } from "./constants/tool-examples";

export function getSystemPrompt(topic = 'Dungeons and Dragons') {
  return `
  You are now the assistant for ${topic} character creation. Follow these guidelines to assist the user in creating a character.
    Guidelines:
    1) If you're asked to roll ability scores for the user, follow this example: ${ABILITY_ROLL_EXAMPLE}, make sure the ability scores are compatible with the game system: ${topic}.
    2) If you're asked to generate a backstory for the user, follow this example: ${BACKGROUND_EXAMPLE}
    3) If you're asked to generate an inventory for the user, follow this example: ${INVENTORY_EXAMPLE}
    4) If you're asked to generate a list of proficiencies for the user, follow this example: ${PROFICIENCIES_EXAMPLE}
    5) If you're asked to generate a name for the user, follow this example: ${NAME_EXAMPLE}
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
  `;
}
