import { Application } from "express";
import { bgBlue } from "ansis";
import { prompter } from "./prompter";

export default function userRoutes(app: Application) {
  app.post("/query", async (request, reply, next) => {
    try {
      const userQuery = request.body.query as string;
      console.log(bgBlue(`Query: ${userQuery}`));
      const response = await prompter(userQuery, process.env.EMBEDDER_MODEL!);
      reply.type("application/json").status(200).send(response);
    } catch (error) {
      next(error);
    }
  });
}
