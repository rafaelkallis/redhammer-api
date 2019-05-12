/**
 * @file app
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import http from "http";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import compress from "koa-compress";
import helmet from "koa-helmet";
import mount from "koa-mount";
import { handleError } from "./middlewares";
import { auth, items } from "./routes";

export const app = new Koa();

app.use(compress());
app.use(bodyParser());
app.use(helmet());

app.use(handleError());
app.use(mount("/auth", auth()));
app.use(mount("/items", items()));

export const server = http.createServer(app.callback());
