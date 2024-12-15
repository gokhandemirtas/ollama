import { ChromaClient, Metadata } from 'chromadb';
import { deleteCollection, getCollectionByName, getCollections, updateKnowledge } from '../utils/database';

import { Application } from 'express';
import { green } from 'ansis';
import { loadDirectory } from '../utils/doc-loader';
import { prompter } from '../utils/prompter';

const topic: Metadata = {
  name: "adnd"
};

export default function setRoutes(app: Application, chromaClient: ChromaClient, llamaClient: any): void {
  app.get('/healthcheck', (request, reply) => {
    reply.send(true);
  });

  app.get('/reset', async (request, reply, next) => {
    try {
      reply.status(200);
      await chromaClient.reset();
      reply.send(true);
    } catch (error) {
      next(error);
    }
  });

  app.get("/collections", async(request, reply, next) => {
    try {
      reply.type("application/json");
      const response = await getCollections(chromaClient);
      reply.send(response);
    } catch (error) {
      next(error);
    }
  });

  app.get("/collection/:name", async(request, reply, next) => {
    try {
      const collection = await getCollectionByName(request.params.name, chromaClient);
      const peek = collection?.peek({
        limit: 1000
      });
      reply.type("application/json").status(200).send(peek);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/collection/:name", async(request, reply, next) => {
    console.log(request.params.name);
    try {
      const name: any = request.params.name;
      const response = await deleteCollection(name, chromaClient);
      reply.type("application/json").status(200).send(response);
    } catch (error) {
      next(error);
    }
  });

  app.get("/loaddocs", async (request, reply, next) => {
    try {
      const response = await loadDirectory(process.env.DOC_BUCKET!, chromaClient, topic);
      response.map((item) => {
        updateKnowledge(item.pageContent, topic, chromaClient);
      });

      reply.type("application/json").status(200).send(response);
    } catch (error) {
      next(error);
    }
  });

  app.post("/query", async (request, reply, next) => {
    try {
      const userQuery = request.body as string;
      console.log(green(`Query: ${userQuery}`));
      const response = await prompter(userQuery, chromaClient, llamaClient);
      reply.type("application/json").status(200).send(response);
    } catch (error) {
      next(error);
    }
  });

}
