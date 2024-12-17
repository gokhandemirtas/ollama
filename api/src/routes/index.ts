import { Application } from 'express';
import { ChromaClient } from 'chromadb';
import adminRoutes from './admin';
import userRoutes from './user';

export default function setRoutes(app: Application, chromaClient: ChromaClient): void {
  app.get('/healthcheck', (request, reply) => {
    reply.type("application/json").status(200).send(true);
  });

  adminRoutes(app, chromaClient);
  userRoutes(app, chromaClient);

}
