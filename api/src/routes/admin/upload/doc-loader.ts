import { JSONLinesLoader, JSONLoader } from "langchain/document_loaders/fs/json";
import { readdirSync, rmSync } from "node:fs";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { log } from "../../../core/logger";

export async function loadDirectory(path = process.env.DOC_BUCKET!) {
	try {
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
	} catch (error) {
		log.error(`[loadDirectory]`, error);
		return Promise.reject(error);
	}
}

function emptyFolder(path: string) {
	readdirSync(path).forEach((f) => rmSync(`${path}/${f}`));
}
