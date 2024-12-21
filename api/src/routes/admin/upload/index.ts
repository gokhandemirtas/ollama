import { countDistinct, eq } from "drizzle-orm";

import { Application } from "express";
import { db } from "../../../core/db";
import { knowledgeSchema } from "../../../core/schemas";
import { loadDirectory } from "./doc-loader";
import { updateKnowledge } from "../management/crud";

export default function uploadRoutes(app: Application) {
  app.delete('/upload', async(request, reply, next) => {
    try {
      await db.delete(knowledgeSchema)
        .where(eq(knowledgeSchema.source, request.body.source));

      const uploads = await db.selectDistinctOn([knowledgeSchema.source])
        .from(knowledgeSchema);

      reply.type("application/json").status(200).send(uploads);
    } catch (error) {
      next(error);
    }
  });

  app.get('/uploads', async(request, reply, next) => {
    try {
      const uploads = await db.selectDistinctOn([knowledgeSchema.source])
        .from(knowledgeSchema);


      reply.type("application/json").status(200).send(uploads.map(({
        source,
        category,
        metadata
      }) => ({
        source,
        category,
        metadata
      })));
    } catch (error) {
      next(error);
    }
  });

  app.post('/upload', async(request, reply, next)  => {
    try {
      if (!!request.files) {
        const file = (request.files as any).file;

        const isExisting = await db.select()
          .from(knowledgeSchema)
          .where(eq(knowledgeSchema.source, file.name));

        if (isExisting.length > 0) {
          reply.type("application/json").status(400).send(`File ${file.name} already exists`);
        } else {
          file.mv(`./${process.env.DOC_BUCKET!}/${request.body.name}`);
          const metadatas = request.body.metadata.split(',').map((name: string) => ({ name: name.replace(' ', '') })) ?? [];
          const knowledge = await loadDirectory(process.env.DOC_BUCKET!);
          knowledge.map((content) => {
            updateKnowledge({
              content,
              metadatas,
              source: request.body.name,
              category: request.body.category
            });
          });

          reply.type("application/json").status(200).send(true);
        }
      } else {
        next('Could not upload file to server');
      }
    } catch (error) {
      next(error);
    }
  });
}
