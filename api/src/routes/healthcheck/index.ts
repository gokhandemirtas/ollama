import { Application } from "express";
import { db } from "../../core/db";
import ky from 'ky';
import { userSchema } from "../../core/schemas";

export default function healthCheckRoutes(app: Application) {
  app.get("/healthcheck", async (request, reply, next) => {
    let isDbOnline, isLLmOnline;
    try {
      const llmUrl = process.env.LLM_URL!;
      const llama = await ky.get(llmUrl, { timeout: 1000});
      isLLmOnline = llama.status === 200;
    } catch (error) {
      isLLmOnline = false;
    }
    try {
      const users = await db.select().from(userSchema);
      isDbOnline = !!users;
    } catch (error) {
      isDbOnline = false;
    }

    reply.type("application/json").status(200).send({
      'isDbOnline': isDbOnline,
      'isLLmOnline': isLLmOnline,
    });
  });
}
