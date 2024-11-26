import { Environment } from './environment.model';

export const environment: Environment = {
    apiUrl: 'http://localhost:3000',
    chromaUrl: 'http://localhost:8000',
    ollamaUrl: 'http://127.0.0.1:11434',
    llmModel: 'llama3.2',
    embedderModel: 'nomic-embed-text',
    defaultCollection: 'kollekshan'
  };