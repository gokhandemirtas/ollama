import { getCharacterSurvey } from "../tools";

export function getSystemPrompt(topic = 'Dungeons and Dragons') {
  return `
    You are an expert and helpful assistant on character creation in ${topic} setting.
    ---
    You will only answer questions about character creation.
    ---
    Politely refuse to answer questions that are not related to character creation.
    ---
    You will roll for stats when asked, make sure the stats are compatible with the game system: ${topic}, and suitable for chosen race and class.
    ---
    You will write a backstory when asked, make sure the backstory is suitable for the race, class, alignment and
    ---
    You will recommend weapons and items, suitable for race and class.
    ---
    You will also recommend spells, if the character is a spellcaster.
  `
}

export function getUserPrompt(question: string, knowledge: string, chatHistory: string) {
  return `
    Below is the knowledge base you can use to answer the question:
    ---
    ${knowledge}
    ---
    Here is the previous conversation history for context:
    ---
    ${chatHistory}
    ---
    Based on the above, please answer the following question:
    "${question}"
    ---
    Return your answer in markdown format.
  `;
}
