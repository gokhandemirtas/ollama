import cors from '@fastify/cors';
import { CSVLoader } from '@langchain/community/document_loaders/fs/csv';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import Fastify from 'fastify';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import {
  JSONLinesLoader,
  JSONLoader,
} from 'langchain/document_loaders/fs/json';
import { TextLoader } from 'langchain/document_loaders/fs/text';

const server = Fastify({
  logger: true,
});
await server.register(cors, { 
  origin: ['http://localhost:4200']
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

server.listen({ port: 3000 }, (err, address) => {
  if (err) throw err
  // Server is now listening on ${address}
})