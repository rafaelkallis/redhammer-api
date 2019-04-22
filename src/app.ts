/**
 * @file router
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as mount from "koa-mount";
import { v1 } from "./v1";

export const app = new Koa();

app.use(bodyParser());
app.use(mount("/v1", v1()));
