import { Application } from "express";
import managementRoutes from "./management";
import uploadRoutes from "./upload";

export default function adminRoutes(app: Application) {
  uploadRoutes(app);
  managementRoutes(app);
}
