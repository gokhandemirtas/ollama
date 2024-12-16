import "dotenv/config";

import { ChromaClient } from "chromadb";
import ErrorHandler from "./utils/error-handler";
import Logger from "./utils/logger";
import cors from "cors";
import { createCollections } from "./utils/database";
import express from "express";
import fileUpload from "express-fileupload";
import { json } from "body-parser";
import setRoutes from "./routes/index";

const app = express();
app.use(json());
app.use(cors({ origin: process.env.CORS_ORIGIN! }));
app.use(fileUpload());
app.use(Logger);
app.use(ErrorHandler);

async function setup() {
  try {
    const chromaClient: ChromaClient = new ChromaClient({ path: process.env.CHROMA_URL });
    await createCollections(chromaClient);
    setRoutes(app, chromaClient);
  } catch (error) {
    console.log(`[Setup DB connection]`, error);
  }
}

app.listen(process.env.API_PORT || 3000, async() => {
  await setup();
  console.table({
    API_PORT: process.env.API_PORT,
    LLM_MODEL: process.env.LLM_MODEL
  });
});
