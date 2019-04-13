/**
 * @file v1 index
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as Router from "koa-router";
import { authRouter } from "./auth";

export const v1Router = new Router();

v1Router.get("/status", ctx => {
  ctx.body = { message: "I'm alive!" };
});

v1Router.use("/auth", authRouter.routes(), authRouter.allowedMethods());
