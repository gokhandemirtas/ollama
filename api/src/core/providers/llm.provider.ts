import { Ollama } from 'ollama';

let ollamaInstance: Ollama | null = null;

export default function getLLM() {
  if (!ollamaInstance) {
    ollamaInstance = new Ollama({ host: process.env.LLM_URL! });
  }
  return ollamaInstance;
}
