import { createRouter } from "@/lib/create-app";
import * as routes from "./auth.routes";
import * as handlers from "./auth.handlers";

const authRouter = createRouter()
	.openapi(routes.playerSignUp, handlers.playerSignUp)
	.openapi(routes.playerSignIn, handlers.playerSignIn)
	.openapi(routes.getPlayerProfile, handlers.getPlayerProfile);

export default authRouter;
