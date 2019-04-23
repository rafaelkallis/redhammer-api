/**
 * @file config
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { getHashes } from "crypto";
import envalid from "envalid";

interface IConfig {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  JWK_SECRET_HEX: string;
  PBKDF2_N_SALT_BYTES: number;
  PBKDF2_N_ITERATIONS: number;
  PBKDF2_N_KEY_BYTES: number;
  PBKDF2_DIGEST: string;
  S3_ACCESS_KEY_ID: string;
  S3_SECRET_ACCESS_KEY: string;
  S3_BUCKET: string;
}

const strHex64 = envalid.makeValidator<string>(x => {
  if (/^[0-9a-f]{64}$/.test(x)) {
    return x;
  }
  throw new Error("Expected a hex-character string of length 64");
});

export const config: Readonly<IConfig> = envalid.cleanEnv<IConfig>(
  process.env,
  {
    NODE_ENV: envalid.str({ choices: ["production", "development", "test"] }),
    PORT: envalid.port(),
    DATABASE_URL: envalid.url(),
    JWK_SECRET_HEX: strHex64(),
    PBKDF2_N_SALT_BYTES: envalid.num(),
    PBKDF2_N_ITERATIONS: envalid.num(),
    PBKDF2_N_KEY_BYTES: envalid.num(),
    PBKDF2_DIGEST: envalid.str({ choices: getHashes() }),
    S3_ACCESS_KEY_ID: envalid.str(),
    S3_SECRET_ACCESS_KEY: envalid.str(),
    S3_BUCKET: envalid.str()
  }
);
