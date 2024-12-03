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
let collection;

const server = Fastify({
  logger: true, 
});

await server.register(cors, { 
  origin: [process.env.WEB_APP_URL]
});

async function setup() {
  chromaClient = new ChromaClient({ path: process.env['CHROMA_URL'] });
  llamaClient = new Ollama({ host: process.env['LLAMA_URL'] });
  const embeddingFunction = new OllamaEmbeddingFunction({
    url: `${process.env.LLAMA_URL}/api/embeddings`,
    model: process.env.EMBEDDER_MODEL
  });

  collection = await chromaClient.getOrCreateCollection({
    name: process.env.DEFAULT_COLLECTION,
    embeddingFunction
  });
}

function updateCollection(content, metadata) {
  collection.upsert({
    documents: [content],
    ids: [uniqueId('llm')],
    metadata
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
  updateCollection(response.map((item) => (item.pageContent)).join(''), 'adnd');
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
    console.log(request.body);
    const collectionResponse = await collection.query({
      queryTexts: request.body,
      nResults: 30,
    });
  
    const llamaResponse = await llamaClient.generate({
      model: process.env.LLM_MODEL,
      prompt: `
        Dungeons and Dragons is a multiplayer game where people can create a character choosing from variety of races, classes, distribute ability points, create a background, and decide on actions by rolling a multi-sided dice and role playing. The abilities and skills of the character is recorded on a character sheet. The dungeon master creates a narrative and a story within the Dungeons and Dragons universe, and players reenact their characters within the story by talking. As the players advance through the game, they acquire experience points which allows them to level up and access better skills that are available to their class and race. For example, a level 0 mage can only do cantrips, where a level 5 mage can cast a fireball spell. The main objective is for the players to work as a team, and help each other to overcome common challenges and dangers.

        You are an an expert on role playing game Dungeons and Dragons. Respond to this prompt ${request.body}, refer to this dungeons and dragons players handbook only ${collectionResponse.documents.join('')}, provide concise and accurate answers.
      `
    });
    reply.type('application/json').code(200);
    updateCollection(llamaResponse, 'adnd');
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