/**
 * @file v1 index
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as Router from "koa-router";
import { authRouter } from "./auth";
import { itemRouter } from "./items";
import { authenticate, handleError } from "./middlewares";

export const v1Router = new Router();

v1Router.use(handleError());

v1Router.get("/status", ctx => {
  ctx.body = { message: "I'm alive!" };
});

v1Router.use("/auth", authRouter.routes(), authRouter.allowedMethods());
v1Router.use(authenticate());
v1Router.use("/items", itemRouter.routes(), itemRouter.allowedMethods());
