import {
  JSONLinesLoader,
  JSONLoader,
} from "langchain/document_loaders/fs/json";

import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { ChromaClient } from "chromadb";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { updateKnowledge } from "./database";

export async function loadDirectory(path = process.env['DOC_BUCKET']!, chromaClient: ChromaClient, topic: any) {
  try {
    const loader = new DirectoryLoader(
      path,
      {
      ".json": (path) => new JSONLoader(path, "/texts"),
      ".jsonl": (path) => new JSONLinesLoader(path, "/html"),
      ".txt": (path) => new TextLoader(path),
      ".csv": (path) => new CSVLoader(path, "text"),
      ".pdf": (path) => new PDFLoader(path)
      }
    );
    const documents = await loader.load();
    documents.map((item) => {
      updateKnowledge(item.pageContent, topic, chromaClient);
    });
    return Promise.resolve(documents)
  } catch (error) {
    console.log(`[GET /loaddocs]`, error);
    return Promise.reject(error)
  }
}
