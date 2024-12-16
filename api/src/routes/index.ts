import { ChromaClient, Metadata } from 'chromadb';
import { createCollections, deleteCollection, getCollectionByName, getCollections, updateKnowledge } from '../utils/database';

import { Application } from 'express';
import { bgBlue } from 'ansis';
import { loadDirectory } from '../utils/doc-loader';
import { prompter } from '../utils/prompter';

const topic: Metadata = {
  name: "adnd"
};

export default function setRoutes(app: Application, chromaClient: ChromaClient): void {
  app.get('/healthcheck', (request, reply) => {
    reply.type("application/json").status(200).send(true);
  });

  app.get('/reset', async (request, reply, next) => {
    try {
      await chromaClient.reset();
      setTimeout(async() => {
        await createCollections(chromaClient);
        reply.type("application/json").status(200).send(true);
      }, 3000);
    } catch (error) {
      next(error);
    }
  });

  app.get("/collections", async(request, reply, next) => {
    try {
      reply.type("application/json");
      const response = await getCollections(chromaClient);
      reply.type("application/json").status(200).send(response);
    } catch (error) {
      next(error);
    }
  });

  app.get("/collection/:name", async(request, reply, next) => {
    try {
      const collection: any = await getCollectionByName(request.params.name, chromaClient);
      const peek = await collection?.peek({
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
      const userQuery = request.body.query as string;
      console.log(bgBlue(`Query: ${userQuery}`));
      const response = await prompter(userQuery, chromaClient);
      reply.type("application/json").status(200).send(response);
    } catch (error) {
      next(error);
    }
  });

}
