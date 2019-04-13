/**
 * @file config
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { getHashes } from "crypto";
import { cleanEnv, makeValidator, num, port, str } from "envalid";

interface IConfig {
  PORT: number;
  JWK_SECRET_HEX: string;
  PBKDF2_N_SALT_BYTES: number;
  PBKDF2_N_ITERATIONS: number;
  PBKDF2_N_KEY_BYTES: number;
  PBKDF2_DIGEST: string;
}

const strHex64 = makeValidator<string>(x => {
  if (/^[0-9a-f]{64}$/.test(x)) {
    return x;
  }
  throw new Error("Expected a hex-character string of length 64");
});

export const config: Readonly<IConfig> = cleanEnv<IConfig>(process.env, {
  PORT: port(),
  JWK_SECRET_HEX: strHex64(),
  PBKDF2_N_SALT_BYTES: num(),
  PBKDF2_N_ITERATIONS: num(),
  PBKDF2_N_KEY_BYTES: num(),
  PBKDF2_DIGEST: str({ choices: getHashes() })
});
