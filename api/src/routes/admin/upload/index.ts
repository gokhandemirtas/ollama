import { Application } from "express";
import { loadDirectory } from "./doc-loader";

export default function uploadRoutes(app: Application) {
  app.post('/upload', async(request, reply, next)  => {
    try {
      if (!!request.files) {
        const file = (request.files as any).file;
        file.mv(`./${process.env.DOC_BUCKET!}/${request.body.name}`);
        const metadatas = request.body.metadata.split(',').map((name: string) => ({ name: name.replace(' ', '') })) && [];
        const uploaded = await loadDirectory(process.env.DOC_BUCKET!, metadatas);
        reply.type("application/json").status(200).send(uploaded);
      } else {
        next('Could not upload file to server');
      }
    } catch (error) {
      next(error);
    }
  });
}
