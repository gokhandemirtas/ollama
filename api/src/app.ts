import "dotenv/config";

import { ChromaClient } from "chromadb";
import cors from "cors";
import { createCollections } from "./utils/database";
import express from "express";
import { json } from "body-parser";
import { modelFile } from "./utils/prompts";
import ollama from "ollama";
import setRoutes from "./routes/index";

const app = express();
app.use(json());
app.use(cors())

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
  console.log("\x1b[35m ------------------------------------------------------------ \x1b[0m");
  console.log(`Server running on: ${process.env.API_PORT}, using: ${process.env.LLM_MODEL}`);
  console.log("\x1b[35m ------------------------------------------------------------ \x1b[0m");
});
