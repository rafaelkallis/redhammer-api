/**
 * @file auth router
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as Router from "koa-router";
import { authController } from "./controller";

export const authRouter = new Router();

authRouter.post("/login", authController.login);
authRouter.post("/signup", authController.signup);
authRouter.post("/verify", authController.verify);
