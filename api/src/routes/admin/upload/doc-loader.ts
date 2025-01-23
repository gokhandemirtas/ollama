import { JSONLinesLoader, JSONLoader } from "langchain/document_loaders/fs/json";
import { readdirSync, rmSync } from "node:fs";

import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import fs from "node:fs"
import { log } from "../../../core/logger";

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

export async function checkUploadDirectory() {
  const path = process.env.DOC_BUCKET!;
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

function emptyFolder(path: string) {
	readdirSync(path).forEach((f) => rmSync(`${path}/${f}`));
}
