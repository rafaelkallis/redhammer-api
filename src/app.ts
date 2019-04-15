/**
 * @file router
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as Router from "koa-router";
import { config } from "./config";
import { v1Router } from "./v1";

const router = new Router();
router.use("/v1", v1Router.routes(), v1Router.allowedMethods());

export const app = new Koa();
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());
