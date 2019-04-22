/**
 * @file index
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as http from "http";
import { app } from "./app";
import { config } from "./config";

export const server = http.createServer(app.callback());

server.listen(config.PORT);
