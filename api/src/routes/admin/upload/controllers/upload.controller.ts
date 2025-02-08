import { JSONLinesLoader, JSONLoader } from "langchain/document_loaders/fs/json";
import { NextFunction, Request, Response } from 'express';
import { readdirSync, rmSync } from "node:fs";

import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { db } from "../../../../core/providers/db.provider";
import { eq } from "drizzle-orm";
import fs from "node:fs"
import { knowledgeSchema } from "../../../../core/schemas";
import { log } from "../../../../core/providers/logger.provider";
import pThrottle from "p-throttle";
import { updateKnowledge } from "../../management/controllers/management.controller";

const throttle = pThrottle({
  limit: 2,
  interval: 500,
})

const abortController = new AbortController();

export async function loadDirectory(path = process.env.DOC_BUCKET!) {
	try {
    if (fs.existsSync(path)) {
      log.info(`[loadDirectory] Loading documents from: ${path}`);
      const loader = new DirectoryLoader(path, {
        ".json": (path) => new JSONLoader(path, "/texts"),
        ".jsonl": (path) => new JSONLinesLoader(path, "/html"),
        ".txt": (path) => new TextLoader(path),
        ".csv": (path) => new CSVLoader(path, "text"),
        ".pdf": (path) => new PDFLoader(path),
      });
      const documents = await loader.load();
      emptyFolder(path);
      return Promise.resolve(documents.map((doc) => doc.pageContent));
    } else {
      log.error(`[loadDirectory] Directory does not exist: ${path}`);
      return Promise.reject('Directory does not exist');
    }

	} catch (error) {
		log.error(`[loadDirectory]`, error);
		return Promise.reject(error);
	}
}

export async function handleFileUploadRequest(req: Request, res: Response, next: NextFunction) {
  const file = (req.files as any).file;
  const metadatas = req.body.metadata
                    .split(",").map((name: string) => ({ name: name.replace(" ", "") })) ?? [];
  const source = req.body.name;
  const category = req.body.category;

  const isExisting = await db.select().
                      from(knowledgeSchema)
                      .where(eq(knowledgeSchema.source, file.name));

  if (isExisting.length > 0) {
    res.type("application/json").status(400).send(`File ${file.name} already exists`);
  } else {
    checkUploadDirectory();
    file.mv(`./${process.env.DOC_BUCKET!}/${req.body.name}`);

    const contents = await loadDirectory(process.env.DOC_BUCKET!);

    await Promise.all([
        ...await contents.map(async(content) => {
          const throttled = throttle(async() => {
            console.log(req.aborted)
            return await updateKnowledge({content, metadatas, source, category});
          });
          return await throttled();
        })
      ]
    )
    log.info(`[handleFileUploadRequest] Uploaded file: ${file.name}`);
    res.type("application/json").status(200).send(true);
  }
}

export async function checkUploadDirectory() {
  const path = process.env.DOC_BUCKET!;
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

function emptyFolder(path: string) {
	readdirSync(path).forEach((f) => rmSync(`${path}/${f}`));
}
