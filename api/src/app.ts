import "dotenv/config";

import cors from "cors";
import express from "express";
import fileUpload from "express-fileupload";
import { json } from "body-parser";
import rateLimit from "express-rate-limit";
import setRoutes from "./routes/index";

const pino = require("pino-http")();

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
	message: "Too many requests from this IP, please try again later.",
});

const app = express();
app.use(json());
app.use(cors({ origin: process.env.WEB_APP_URL! }));
app.use(fileUpload());
setRoutes(app);
app.use(pino);
app.use(limiter);

app.listen(process.env.API_PORT || 3000, async () => {
	console.table({
		API_PORT: process.env.API_PORT,
    LLAMA_URL: process.env.LLAMA_URL,
		LLM_MODEL: process.env.LLM_MODEL,
		EMBEDDER_MODEL: process.env.EMBEDDER_MODEL,
	});
});
