import { Application, Request, Response } from 'express';
import { ChromaClient, Metadata } from 'chromadb';
import { deleteCollection, getCollectionByName, getCollections, updateKnowledge } from '../utils/database';

import { Router } from 'express';
import { loadDirectory } from '../utils/doc-loader';
import { prompter } from '../utils/prompter';

const router = Router();

const topic: Metadata = {
  name: "adnd"
};

export default function setRoutes(app: Application, chromaClient: ChromaClient, llamaClient: any): void {
  app.get('/', (req, res) => {
    res.send('GET request to the homepage')
  });

  app.get("/collections", async(request, reply) => {
    try {
      reply.type("application/json");
      return await getCollections(chromaClient);
    } catch (error) {
      reply.type("application/json");
      console.log(`[GET /collections]`, error);
      return { error }
    }
  });

  app.get("/collection/:name", async(request, reply) => {
    try {
      const collection = await getCollectionByName(request.body as string, chromaClient);
      const peek = collection?.peek({
        limit: 1000
      });
      reply.type("application/json");
      return peek
    } catch (error) {
      reply.type("application/json");
      console.log(`[GET /collection/:name]`, error);
      return { error }
    }
  });

  app.delete("/collection/:name", async(request, reply) => {
    try {
      const name: any = request.body;
      reply.type("application/json");
      return await deleteCollection(name, chromaClient);
    } catch (error) {
      console.log(`[DELETE /collection/:name]`, error);
      reply.type("application/json");
      return { error }
    }
  });

  app.get("/loaddocs", async (request, reply) => {
    try {
      const response = await loadDirectory(process.env.DOC_BUCKET!, chromaClient, topic);
      response.map((item) => {
        updateKnowledge(item.pageContent, topic, chromaClient);
      });

      reply.type("application/json");
      return null;
    } catch (error) {
      console.log(`[GET /loaddocs]`, error);
      reply.type("application/json");
      return { error }
    }
  });

  app.post("/query", async (request, reply) => {
    try {
      const userQuery = request.body as string;
      console.log("\x1b[36m%s\x1b[0m", `Query: ${userQuery}`);
      const response = await prompter(userQuery, chromaClient, llamaClient);
      reply.type("application/json");
      return response;
    } catch (error) {
      console.log("Error while replying to query:", error);
      reply.type("application/json");
      return { error };
    }
  });
}
