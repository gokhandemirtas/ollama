import { TOOL_EXAMPLE_1, TOOL_EXAMPLE_2 } from "./constants/tool-examples";

export function getSystemPrompt(topic = 'Dungeons and Dragons') {
  return `
    You are a helpful assistant specialized in ${topic}. Your task is to take a question and find the most appropriate tool or tools to execute.
    ---
    Guidelines:
    1. Only answer questions related to ${topic}. Politely refuse to answer questions that are not related.
    2. When presenting multiple options, use a markdown unordered list. Only do this if the option is a single word.
    3. Follow below examples to decide which tool to use.
    ---
    ${TOOL_EXAMPLE_1}
    ${TOOL_EXAMPLE_2}
  `;
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
    Guidelines:
    1. Use the knowledge base and conversation history to provide a relevant and accurate answer.
    2. Ensure your answer is in markdown format.
  `;
}
