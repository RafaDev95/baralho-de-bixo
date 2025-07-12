import { createRouter } from "@/lib/create-app";
import * as routes from "./trades.routes";
import * as handlers from "./trades.handlers";

const router = createRouter()
	.openapi(routes.list, handlers.list)
	.openapi(routes.getById, handlers.getById)
	.openapi(routes.create, handlers.create)
	.openapi(routes.update, handlers.update)
	.openapi(routes.remove, handlers.remove);

export default router;
