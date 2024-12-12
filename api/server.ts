import cors from '@fastify/cors';
import { CSVLoader } from '@langchain/community/document_loaders/fs/csv';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import Collection,  { ChromaClient, OllamaEmbeddingFunction, Metadata } from 'chromadb';

import 'dotenv/config';
import Fastify from 'fastify';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import {
  JSONLinesLoader,
  JSONLoader,
} from 'langchain/document_loaders/fs/json';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { uniqueId } from 'lodash-es';
import ollama, { Ollama } from 'ollama';

let chromaClient: ChromaClient;
let llamaClient: any;

const topic: Metadata = {
  adnd: process.env.TOPIC!
};

const embeddingFunction = new OllamaEmbeddingFunction({
  url: `${process.env.LLAMA_URL}/api/embeddings`,
  model: process.env.EMBEDDER_MODEL!
});

const server = Fastify({
  logger: true, 
});

await server.register(cors, { 
  origin: [process.env.WEB_APP_URL]
});

async function createCollections() {
  const name = process.env.CHAT_HISTORY_COLLECTION!;
  try {
    await chromaClient.getOrCreateCollection({
      name,
      embeddingFunction
    });
  } catch (error) {
    console.log(`[createCollections:${name}]`, error);
  }

  try {
    await chromaClient.getOrCreateCollection({
      name: process.env.KNOWLEDGE_COLLECTION!,
      embeddingFunction
    }); 
  } catch (error) {
    console.log(`[createCollections:${name}]`, error);
  }
}

async function getCollectionByName(name: string) {
  try {
    return await chromaClient.getCollection({
      name,
      embeddingFunction
    }); 
  } catch (error) {
    console.log(`[getCollectionByName:${name}]`, error);
  }
}

async function setup() {
  chromaClient = new ChromaClient({ path: process.env.CHROMA_URL });

  llamaClient = await ollama.create({
    model: process.env.LLM_MODEL!,
    path: process.env.LLAMA_URL!
  });

  await createCollections();
}

function getSystemPrompt() {
  return `
    You are an expert and helpful assistant on role playing game Dungeons and Dragons.
  `
}

function getUserPrompt(question: string, knowledge: string, chatHistory: string) {
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
  `;
}

async function updateKnowledge(content: string) {
  try {
    const knowledgeCollection = await getCollectionByName(process.env.KNOWLEDGE_COLLECTION!);
    knowledgeCollection?.upsert({
      documents: [content],
      ids: [uniqueId('llm')],
      metadatas: [topic]
    });
  } catch (error) {
    console.log(`[updateKnowledge]`, error);
  }
}

async function updateChatHistory(role: string, content: string) {
  try {
    const chatHistoryCollection = await getCollectionByName(process.env.CHAT_HISTORY_COLLECTION!);
    if (role && content) {
      chatHistoryCollection?.upsert({
        documents: [content],
        ids: [uniqueId(role)],
        metadatas: [{ role, timestamp: new Date().toISOString() }],
      });
    }
  } catch (error) {
    console.log(`[updateChatHistory]`, error);
  }
}

server.get('/heartbeat', (request, reply) => {
  chromaClient.heartbeat();
})

server.get('/reset', (request, reply) => {
  chromaClient.reset();
})

server.get('/collections', async(request, reply) => {
  try {
    const collections = await chromaClient.listCollections();
    reply.type('application/json').code(200);
    return collections
  } catch (error) {
    reply.type('application/json').code(500);
    console.log(`[GET /collections]`, error);
    return { error }
  }
})

server.get('/collection/:name', async(request, reply) => {
  try {
    const collection = await getCollectionByName(request.body as string);
    const peek = collection?.peek({
      limit: 1000
    });
    reply.type('application/json').code(200);
    return peek
  } catch (error) {
    reply.type('application/json').code(500);
    console.log(`[GET /collection/:name]`, error);
    return { error }
  }
})

server.delete('/collection/:name', async(request, reply) => {
  try {
    const name: any = request.body;
    const collections = await chromaClient.deleteCollection({
      name
    });
    reply.type('application/json').code(200);
    return collections
  } catch (error) {
    console.log(`[DELETE /collection/:name]`, error);
    reply.type('application/json').code(500);
    return { error }
  }
})

server.get('/loaddocs', async (request, reply) => {
  let response;
  try {
    const loader = new DirectoryLoader(
      './src/docbucket',
      {
      '.json': (path) => new JSONLoader(path, '/texts'),
      '.jsonl': (path) => new JSONLinesLoader(path, '/html'),
      '.txt': (path) => new TextLoader(path),
      '.csv': (path) => new CSVLoader(path, 'text'),
      '.pdf': (path) => new PDFLoader(path)
      }
    );
    response = await loader.load();
    response.map((item) => {
      updateKnowledge(item.pageContent);
    });
  
	  reply.type('application/json').code(200);
	  return null;
  } catch (error) {
    console.log(`[GET /loaddocs]`, error);
    reply.type('application/json').code(500);
    return { error }
  }
})

server.post('/query', async (request, reply) => {
  try {
    const userQuery = request.body as string;
    console.log('\x1b[36m%s\x1b[0m', `Query: ${userQuery}`);

    const knowledgeCollection = await getCollectionByName(process.env.KNOWLEDGE_COLLECTION!);
    const knowledge = knowledgeCollection!.query({
      queryTexts: [userQuery],
      nResults: 30,
    });

    const chatHistoryCollection = await getCollectionByName(process.env.KNOWLEDGE_COLLECTION!);
    const chatHistoryResponse = await chatHistoryCollection!.peek({
      limit: 50,
    });
    const chatHistory = chatHistoryResponse.documents
      ? chatHistoryResponse.documents.map(doc => `[${doc?.metadata?.role}] ${doc?.message?.content}`).join('\n')
      : "No previous conversation available.";

    const userPrompt = getUserPrompt(
      userQuery,
      knowledge.documents.map(doc => doc.message?.content || "").join("\n"),
      chatHistory
    );

    const llamaResponse = await llamaClient.chat({
      model: process.env.LLM_MODEL,
      messages: [
        { role: 'system', content: getSystemPrompt() },
        { role: 'user', content: userPrompt },
        { role: 'user', content: `Previous conversation:\n${chatHistory}` }, // Explicitly add previous history
      ],
    });

    // Update chat history with the user query
    updateChatHistory('assistant', llamaResponse.message.content);
    updateChatHistory('user', userQuery ?? 'No previous questions.');

    reply.type('application/json').code(200);
    return llamaResponse;
  } catch (error) {
    console.log('Error while replying to query:', error);
    reply.type('application/json').code(500);
    return { error };
  }
});

server.listen({ port: 3000 }, (err, address) => {
  if (err) throw err
  setup();
  console.log("\x1b[35m ------------------------------------------------------------ \x1b[0m");
  console.log(`Server running on: ${address}, using: ${process.env.LLM_MODEL}`);
  console.log("\x1b[35m ------------------------------------------------------------ \x1b[0m");
  // Server is now listening on ${address}
})