/**
 * @file v1 index
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as Router from "koa-router";

export const v1Router = new Router();

v1Router.get("/status", ctx => {
  ctx.body = { message: "I'm alive!" };
});
