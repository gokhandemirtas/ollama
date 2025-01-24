import { Application } from "express";
import { db } from "../../../core/providers/db.provider";
import { eq } from "drizzle-orm";
import { handleFileUploadRequest } from "./controllers/upload.controller";
import { knowledgeSchema } from "../../../core/schemas";

export default function uploadRoutes(app: Application) {
	app.delete("/upload", async (request, reply, next) => {
		try {
			await db.delete(knowledgeSchema).where(eq(knowledgeSchema.source, request.body.source));

			const uploads = await db.selectDistinctOn([knowledgeSchema.source]).from(knowledgeSchema);

			reply.type("application/json").status(200).send(uploads);
		} catch (error) {
			next(error);
		}
	});

	app.get("/upload/:source", async (request, reply, next) => {
		try {
			const upload = await db.select().from(knowledgeSchema).where(eq(knowledgeSchema.source, request.params.source));

			reply
				.type("application/json")
				.status(200)
				.send({ content: upload.map((item) => item.content).join("/n") });
		} catch (error) {
			next(error);
		}
	});

	app.get("/uploads", async (request, reply, next) => {
		try {
			const uploads = await db.selectDistinctOn([knowledgeSchema.source]).from(knowledgeSchema);

			reply
				.type("application/json")
				.status(200)
				.send(
					uploads.map(({ source, category, metadata }) => ({
						source,
						category,
						metadata,
					}))
				);
		} catch (error) {
			next(error);
		}
	});

	app.post("/upload", async (request, reply, next) => {
		try {
			if (request.files) {
        handleFileUploadRequest(request, reply, next);
			} else {
				next("Can not find files in the request");
			}
		} catch (error) {
			next(error);
		}
	});
}
