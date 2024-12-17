import "dotenv/config";

import ErrorHandler from "./core/error-handler";
import Logger from "./core/logger";
import cors from "cors";
import express from "express";
import fileUpload from "express-fileupload";
import { json } from "body-parser";
import setRoutes from "./routes/index";

const app = express();
app.use(json());
app.use(cors({ origin: process.env.CORS_ORIGIN! }));
app.use(fileUpload());
setRoutes(app);
app.use(Logger);
app.use(ErrorHandler);

app.listen(process.env.API_PORT || 3000, async() => {
  console.table({
    API_PORT: process.env.API_PORT,
    LLM_MODEL: process.env.LLM_MODEL
  });
});
