import { Application } from "express";
import { ChromaClient } from "chromadb";
import managementRoutes from "./management";
import uploadRoutes from "./upload";

export default function adminRoutes(app: Application, chromaClient: ChromaClient) {
  uploadRoutes(app, chromaClient);
  managementRoutes(app, chromaClient);
}
