import { Ollama } from 'ollama';

let ollamaInstance: Ollama | null = null;

export default function getOllama() {
  if (!ollamaInstance) {
    ollamaInstance = new Ollama({ host: process.env.LLAMA_URL! });
  }
  return ollamaInstance;
}
