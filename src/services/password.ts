/**
 * @file password service
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { pbkdf2, randomBytes } from "crypto";
import { config } from "../config";

export const password = {
  /**
   * Generates a pseudorandom salt for the password hash.
   */
  genSalt(): string {
    return randomBytes(config.PBKDF2_N_SALT_BYTES).toString("ascii");
  },

  /**
   * Produces a cryptographic hash for the given password plaintext and salt.
   */
  async hash(plaintext: string, salt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      pbkdf2(
        plaintext,
        salt,
        config.PBKDF2_N_ITERATIONS,
        config.PBKDF2_N_KEY_BYTES,
        config.PBKDF2_DIGEST,
        (err, derivedKey) => {
          if (err) {
            reject(err);
          }
          resolve(derivedKey.toString("ascii"));
        }
      );
    });
  },

  /**
   * Compares the given password paintext and salt against the cryptographic hash.
   */
  async verify(
    plaintext: string,
    salt: string,
    hash: string
  ): Promise<boolean> {
    return hash === (await this.hash(plaintext, salt));
  }
};
