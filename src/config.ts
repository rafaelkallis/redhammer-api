/**
 * @file config
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { cleanEnv, makeValidator, port } from "envalid";

interface IConfig {
  PORT: number;
  JWK_SECRET_HEX: string;
}

const strHex64 = makeValidator<string>(x => {
  if (/^[0-9a-f]{64}$/.test(x)) {
    return x;
  }
  throw new Error("Expected a hex-character string of length 64");
});

export const config: Readonly<IConfig> = cleanEnv<IConfig>(process.env, {
  PORT: port(),
  JWK_SECRET_HEX: strHex64()
});
