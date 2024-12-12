import cors from '@fastify/cors';
import { CSVLoader } from '@langchain/community/document_loaders/fs/csv';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { ChromaClient, OllamaEmbeddingFunction } from 'chromadb';
import 'dotenv/config';
import Fastify from 'fastify';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import {
  JSONLinesLoader,
  JSONLoader,
} from 'langchain/document_loaders/fs/json';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { uniqueId } from 'lodash-es';
import { Ollama } from 'ollama';

let chromaClient;
let llamaClient;
let chatHistoryCollection;
let knowledgeCollection;
const topic = 'ADND';

const server = Fastify({
  logger: true, 
});

await server.register(cors, { 
  origin: [process.env.WEB_APP_URL]
});

async function setup() {
  chromaClient = new ChromaClient({ path: process.env.CHROMA_URL });
  llamaClient = new Ollama({ baseUrl: process.env.LLAMA_URL, model: process.env.LLM_MODEL });

  chatHistoryCollection = await chromaClient.getOrCreateCollection({
    name: process.env.USER_COLLECTION,
    embeddingFunction: new OllamaEmbeddingFunction({
      url: `${process.env.LLAMA_URL}/api/embeddings`,
      model: process.env.EMBEDDER_MODEL
    })
  });

  knowledgeCollection = await chromaClient.getOrCreateCollection({
    name: topic,
    embeddingFunction: new OllamaEmbeddingFunction({
      url: `${process.env.LLAMA_URL}/api/embeddings`,
      model: process.env.EMBEDDER_MODEL
    })
  });
}

function getSystemPrompt() {
  return `
    You are an expert and helpful assistant on role playing game Dungeons and Dragons.
  `
}

function getUserPrompt(question, knowledge, chatHistory) {
  console.log(chatHistory);
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


function updateKnowledge(content) {
  knowledgeCollection.upsert({
    documents: [content],
    ids: [uniqueId('llm')],
    metadata: [topic]
  });
}

function updateChatHistory(role, content) {
  if (role && content) {
    chatHistoryCollection.upsert({
      documents: [content],
      ids: [uniqueId(role)],
      metadata: { role, timestamp: new Date().toISOString() },
    });
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
    return { error }
  }
})

server.get('/collection/:name', async(request, reply) => {
  try {
    const peek = await chatHistoryCollection.peek({
      limit: 1000
    });
    reply.type('application/json').code(200);
    return peek
  } catch (error) {
    reply.type('application/json').code(500);
    return { error }
  }
})

server.delete('/collection/:name', async(request, reply) => {
  try {
    const collections = await chromaClient.deleteCollection({
      name: request.params.name
    });
    reply.type('application/json').code(200);
    return collections
  } catch (error) {
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
    console.log(error);
    reply.type('application/json').code(500);
    return { error }
  }
})

server.post('/query', async (request, reply) => {
  try {
    const userQuery = request.body; // Assume the user's query is passed in `query`
    console.log('\x1b[36m%s\x1b[0m', `Query: ${userQuery}`);

    // Fetch relevant knowledge
    const knowledge = await knowledgeCollection.query({
      queryTexts: [userQuery],
      nResults: 30,
    });

    // Fetch chat history, handle empty history gracefully
    const chatHistoryResponse = await chatHistoryCollection.peek({
      limit: 50,
    });
    const chatHistory = chatHistoryResponse.documents
      ? chatHistoryResponse.documents.map(doc => `[${doc?.metadata?.role}] ${doc?.message?.content}`).join('\n')
      : "No previous conversation available.";

    // Construct user prompt
    const userPrompt = getUserPrompt(
      userQuery,
      knowledge.documents.map(doc => doc.message?.content || "").join("\n"),
      chatHistory
    );

    // Query LLM with system and user prompts
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