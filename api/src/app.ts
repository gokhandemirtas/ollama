import "dotenv/config";

import cors from "cors";
import express from "express";
import { expressErrorMiddleware } from "./core/error-response.provider";
import fileUpload from "express-fileupload";
import { json } from "body-parser";
import rateLimit from "express-rate-limit";
import setRoutes from "./routes/index";

const pino = require("pino");
const pinoHttp = require("pino-http")({
  logger: pino({
    level: "error",
    transport: {
      target: "pino-pretty"
    }
  })
});

const limiter = rateLimit({
	windowMs: 15 * 60 * 2000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
	message: "Too many requests from this IP, please try again tomorrow later .",
});

const app = express();
app.use(pinoHttp);
app.use(json());
app.use(cors({ origin: process.env.WEB_APP_URL! }));
app.use(fileUpload());
// app.use(limiter);
app.use(expressErrorMiddleware);
setRoutes(app);

app.listen(process.env.API_PORT || 3000, async () => {
	console.table({
		API_PORT: process.env.API_PORT,
    LLM_URL: process.env.LLM_URL,
		LLM_MODEL: process.env.LLM_MODEL,
		EMBEDDER_MODEL: process.env.EMBEDDER_MODEL,
	});
});
