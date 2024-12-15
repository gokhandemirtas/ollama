import "dotenv/config";

import { ChromaClient } from "chromadb";
import ErrorHandler from "./utils/error-handler";
import Logger from "./utils/logger";
import cors from "cors";
import { createCollections } from "./utils/database";
import express from "express";
import { json } from "body-parser";
import { modelFile } from "./utils/prompts";
import ollama from "ollama";
import setRoutes from "./routes/index";

const app = express();
app.use(json());
app.use(cors({ origin: process.env.CORS_ORIGIN! }));
app.use(Logger);
app.use(ErrorHandler);

let chromaClient: ChromaClient;
let llamaClient: any;

async function setup() {
  try {
    chromaClient = new ChromaClient({ path: process.env.CHROMA_URL });
    await createCollections(chromaClient);
  } catch (error) {
    console.log(`[Setup DB connection]`, error);
  }
  try {
    llamaClient = await ollama.create({
      model: process.env.LLM_MODEL!,
      modelfile: modelFile
    });
  } catch (error) {
    console.log(`[Setup Ollama connection]`, error);
  }
  setRoutes(app, chromaClient, llamaClient);
}

app.listen(process.env.API_PORT || 3000, async() => {
  await setup();
  console.table({
    API_PORT: process.env.API_PORT,
    LLM_MODEL: process.env.LLM_MODEL
  });
});
