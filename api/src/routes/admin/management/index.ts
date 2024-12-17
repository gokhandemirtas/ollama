import { deleteCollection, getCollections, getTable } from "./crud";

import { Application } from "express";

export default function managementRoutes(app: Application): void {
  app.get('/reset', async (request, reply, next) => {
    try {
/*       await chromaClient.reset();
      setTimeout(async() => {
        await createCollections(chromaClient);
        reply.type("application/json").status(200).send(true);
      }, 3000); */
    } catch (error) {
      next(error);
    }
  });

  app.get("/collections", async(request, reply, next) => {
    try {
      reply.type("application/json");
      const response = await getCollections();
      reply.type("application/json").status(200).send(response);
    } catch (error) {
      next(error);
    }
  });

  app.get("/collection/:name", async(request, reply, next) => {
    try {
      const collection: any = await getTable(request.params.name);
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
      const response = await deleteCollection(name);
      reply.type("application/json").status(200).send(response);
    } catch (error) {
      next(error);
    }
  });
}
