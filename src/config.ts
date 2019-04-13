/**
 * @file config
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { cleanEnv, port } from "envalid";

interface IConfig {
  PORT: number;
}

export const config = cleanEnv<IConfig>(process.env, {
  PORT: port()
});
