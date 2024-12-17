import { ChromaClient, Metadata } from "chromadb";
import {
  JSONLinesLoader,
  JSONLoader,
} from "langchain/document_loaders/fs/json";

import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
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
    documents.map((item) => {
      updateKnowledge(item.pageContent, metadatas);
    });
    return Promise.resolve(documents)
  } catch (error) {
    return Promise.reject(error)
  }
}
