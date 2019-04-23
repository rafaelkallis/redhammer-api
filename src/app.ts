/**
 * @file app
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import http from "http";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import mount from "koa-mount";
import { v1 } from "./v1";

export const app = new Koa();

app.use(bodyParser());
app.use(mount("/v1", v1()));

export const server = http.createServer(app.callback());
