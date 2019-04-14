/**
 * @file router
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as Router from "koa-router";
import { v1Router } from "./v1/router";

export const router = new Router();

router.use("/v1", v1Router.routes(), v1Router.allowedMethods());
