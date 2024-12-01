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
    documents: [content.response],
    ids: [uniqueId('llm')],
    metadata
  });
}

server.get('/heartbeat', (request, reply) => {
  chromaClient.heartbeat();
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
    console.log('delete', request.params.name);
    const collections = await chromaClient.deleteCollection({
      collectionName: request.params.name
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
	reply.type('application/json').code(200);
	return { response }
  } catch (error) {
    console.log(error);
    reply.type('application/json').code(500);
    return { error }
  }
})

server.post('/query', async (request, reply) => {
  try {
    const collectionResponse = await collection.query({
      queryTexts: request.body,
      nResults: 30,
    });
  
    const llamaResponse = await llamaClient.generate({
      model: process.env.LLM_MODEL,
      prompt: `
        You give me brief answers to my question
        Only using this data: ${collectionResponse.documents.join()}. Respond to this prompt: ${request.body}
      `
    });
    reply.type('application/json').code(200);
    updateCollection(llamaResponse, 'lamas');
    return llamaResponse
  } catch (error) {
    reply.type('application/json').code(500);
    return { error }
  }
});

server.listen({ port: 3000 }, (err, address) => {
  if (err) throw err
  setup();
  // Server is now listening on ${address}
})