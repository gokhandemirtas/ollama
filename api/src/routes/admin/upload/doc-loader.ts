import {
  JSONLinesLoader,
  JSONLoader,
} from "langchain/document_loaders/fs/json";
import { readdirSync, rmSync } from "fs";

import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { Metadata } from "../../../core/models/metadata";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { updateKnowledge } from "../management/crud";

export async function loadDirectory(path = process.env.DOC_BUCKET!, metadatas: Array<Metadata>) {
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
    const joined = documents.map(doc => doc.pageContent).join("\n");
    updateKnowledge(joined, metadatas);
    emptyFolder(path);
    return Promise.resolve(documents)
  } catch (error) {
    return Promise.reject(error)
  }
}

function emptyFolder(path: string) {
  readdirSync(path).forEach(f => rmSync(`${path}/${f}`));
}
