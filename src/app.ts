/**
 * @file app
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as mount from "koa-mount";
import { config } from "./config";
import { v1 } from "./v1";
import { sequelize } from "./v1/db";

export const app = new Koa();

app.use(bodyParser());
app.use(mount("/v1", v1()));

export const server = app.listen(config.PORT);

process.on("SIGTERM", function onSignTerm() {
  server.close(async function onClose() {
    await sequelize.close();
  });
});
