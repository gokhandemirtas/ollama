import { Application } from "express";
import { loadDirectory } from "./doc-loader";
import { updateKnowledge } from "../management/crud";

export default function uploadRoutes(app: Application) {
  app.post('/upload', async(request, reply, next)  => {
    try {
      if (!!request.files) {
        const file = (request.files as any).file;
        file.mv(`./${process.env.DOC_BUCKET!}/${request.body.name}`);
        const metadatas = request.body.metadata.split(',').map((name: string) => ({ name: name.replace(' ', '') })) ?? [];
        const knowledge = await loadDirectory(process.env.DOC_BUCKET!);
        const updated = updateKnowledge({
          content: knowledge,
          metadatas,
          source: request.body.name,
          category: request.body.category
        });
        reply.type("application/json").status(200).send(updated);
      } else {
        next('Could not upload file to server');
      }
    } catch (error) {
      next(error);
    }
  });
}
