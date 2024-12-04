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
let userCollection;
let knowledgeCollection;
const topic = 'ADND';

const server = Fastify({
  logger: true, 
});

await server.register(cors, { 
  origin: [process.env.WEB_APP_URL]
});

async function setup() {
  chromaClient = new ChromaClient({ path: process.env['CHROMA_URL'] });
  llamaClient = new Ollama({ host: process.env['LLAMA_URL'] });

  userCollection = await chromaClient.getOrCreateCollection({
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

function updateKnowledge(content) {
  knowledgeCollection.upsert({
    documents: [content],
    ids: [uniqueId('llm')],
    metadata: [topic]
  });
}

function updateUserResponse(question, answer) {
  userCollection.upsert({
    documents: [question, answer],
    ids: [uniqueId('question'), uniqueId('answer')],
    metadata: ['user-answers']
  });
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
    const peek = await knowledgeCollection.peek({
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
    console.log(`%c Query: ${request.body} `, 'background: #00C424; color: #fff');
    const knowledge = await knowledgeCollection.query({
      queryTexts: request.body,
      nResults: 5
    });

    const userResponse = await userCollection.query({
      queryTexts: request.body,
      nResults: 5
    });
  

    console.log(userResponse);

    const llamaResponse = await llamaClient.generate({
      model: process.env.LLM_MODEL,
      system: `
        You are an an expert on role playing game Dungeons and Dragons, and this is your knowledge base:
        ${knowledge.documents.join('')}. Dungeons and Dragons is a multiplayer game where people can create a character choosing from variety of races, classes, distribute ability points, create a background, and decide on actions by rolling a multi-sided dice and role playing. The abilities and skills of the character is recorded on a character sheet.
        
        The dungeon master creates a narrative and a story within the Dungeons and Dragons universe, and players reenact their characters within the story by talking. As the players advance through the game, they acquire experience points which allows them to level up and access better skills that are available to their class and race. For example, a level 0 mage can only do cantrips, where a level 5 mage can cast a fireball spell. The main objective is for the players to work as a team, and help each other to overcome common challenges and dangers.`,
      prompt: `
        Answer this question ${request.body} in a short, clear manner. Remember the answers you've given before by checking ${userResponse.documents.join('')}.
      `
    });
    reply.type('application/json').code(200);
    updateUserResponse(request.body, llamaResponse.response);
    console.log(`%c Response: ${llamaResponse.response} `, 'background: #0188FF; color: #fff');
    return llamaResponse
  } catch (error) {
    console.log('error while replying query: ', error)
    reply.type('application/json').code(500);
    return { error }
  }
});

server.listen({ port: 3000 }, (err, address) => {
  if (err) throw err
  setup();
  console.log(`Server running on: ${address}, using: ${process.env.LLM_MODEL}` )
  // Server is now listening on ${address}
})