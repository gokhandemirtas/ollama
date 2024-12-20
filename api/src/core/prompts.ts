export function getSystemPrompt(topic = 'role playing game Dungeons and Dragons') {
  return `
    You are an expert and helpful assistant on ${topic}.
  `
}

export function getUserPrompt(question: string, knowledge: string, chatHistory: string) {
  return `
    You are an expert and helpful assistant specializing in Dungeons and Dragons.
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
