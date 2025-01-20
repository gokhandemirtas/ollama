import "dotenv/config";

import ErrorHandler from "./core/error-handler";
import Logger from "./core/logger";
import cors from "cors";
import express from "express";
import fileUpload from "express-fileupload";
import { json } from "body-parser";
import rateLimit from "express-rate-limit";
import setRoutes from "./routes/index";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

const app = express();
app.use(json());
app.use(cors({ origin: process.env.WEB_APP_URL! }));
app.use(fileUpload());
setRoutes(app);
app.use(Logger);
app.use(ErrorHandler);
app.use(limiter);

app.listen(process.env.API_PORT || 3000, async() => {
  console.table({
    API_PORT: process.env.API_PORT,
    LLM_MODEL: process.env.LLM_MODEL,
    EMBEDDER_MODEL: process.env.EMBEDDER_MODEL,
  });
});
