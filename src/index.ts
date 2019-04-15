/**
 * @file index
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { app } from "./app";
import { config } from "./config";

export const server = app.listen(config.PORT);
