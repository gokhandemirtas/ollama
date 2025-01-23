import { getTable } from "./crud";

import { Application } from "express";

export default function managementRoutes(app: Application): void {
	app.get("/collection/:name", async (request, reply, next) => {
		try {
			const collection: any = await getTable(request.params.name);
			const peek = await collection?.peek({
				limit: 1000,
			});

			reply.type("application/json").status(200).send(peek);
		} catch (error) {
			next(error);
		}
	});
}
