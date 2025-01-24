import { createCharacter } from "./tools";

export function getSystemPrompt(topic = 'role playing game Dungeons and Dragons') {
  return `
    You are an expert and helpful assistant on ${topic}.
    ---
    You will only answer questions related to ${topic}.
    ---
    Politely refuse to answer questions that are not related to ${topic}.
    ---
    You are only responsible for the following tasks:

    1. Answering questions related to ${topic}.
    2. Only call saveCharacter tool when user asks to save a character. Do not call it without user prompt
    3. Only call retrieveCharacters tool when user asks to retrieve a character.
    4. When user asks to create a character, prompt the user to provide the following information, one at a time:
        ${createCharacter()}
    5. When user answers a previous question remember the answer, and ask the next question
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
