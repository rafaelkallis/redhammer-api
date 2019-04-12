/**
 * @file index
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as Koa from "koa";
import * as Router from "koa-router";
import { router } from "./router";

const app = new Koa();

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
