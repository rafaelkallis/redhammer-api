/**
 * @file token service
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import base64url from "base64url";
import * as moment from "moment";
import * as jose from "node-jose";
import { config } from "../config";

/**
 * Buffer of JWK secret
 */
const jwkSecretBuffer = Buffer.from(config.JWK_SECRET_HEX, "hex");

/**
 * json web key (JWK)
 *
 * JWK @see https://tools.ietf.org/html/rfc7517
 * example JWK @see https://tools.ietf.org/html/rfc7517#section-3
 * JWA @see https://tools.ietf.org/html/rfc7518
 * symmetric key JWK @see https://tools.ietf.org/html/rfc7518#section-6.4
 * minimum key sizes @see https://tools.ietf.org/html/rfc7518#section-3.2
 */
const jwk = jose.JWK.asKey({
  kty: "oct",
  k: jose.util.base64url.encode(jwkSecretBuffer)
});

export const token = {
  /**
   * Signs the given payload and returns a JWT.
   *
   * @param {Object} payload - The payload to sign.
   * @return {Promise<string>} - A signed json web token.
   */
  async sign(payload: object): Promise<string> {
    return jose.JWS.createSign({ format: "compact" }, await jwk)
      .update(Buffer.from(JSON.stringify(payload), "utf8"))
      .final();
  },
  /**
   * Verifies the given JWS and returns the decoded payload.
   * Rejects if  signature is invalid.
   * @param {string} token - The json web token.
   * @return {Promise<T>} - The decoded payload.
   */
  async verifySignature<T>(jwt: string): Promise<T> {
    const { payload } = await jose.JWS.createVerify(await jwk).verify(jwt);
    return JSON.parse(payload.toString("utf8"));
  },

  /**
   * Encrypts the given payload and returns a JWT.
   * @param {Object} payload - The payload to encrypt.
   * @return {Promise<string>} - An encrypted json web token.
   */
  async encrypt(payload: object): Promise<string> {
    return jose.JWE.createEncrypt({ format: "compact" }, await jwk)
      .update(Buffer.from(JSON.stringify(payload)))
      .final();
  },

  /**
   * Decrypts the given JWE token  and returns the decrypted
   * payload. Rejects if ciphertext is invalid.
   * @param {string} token - The encrypted json web token.
   * @return {Promise<Object>} - The decrypted payload.
   */
  async decrypt<T>(jwe: string): Promise<T> {
    const { payload } = await jose.JWE.createDecrypt(await jwk).decrypt(jwe);
    return JSON.parse(payload.toString("utf8"));
  },

  /**
   * Timestamps the given JWT token payload, i.e.
   * adds or overrides a "iat" claim and assigns to it the current time.
   * adds or overrides a "exp" claim  nd assigns to it the current time + value.
   * "exp" claim is only asigned if lifetime is provided.
   * specified in lifetime parameter.
   *
   * More information regarding the claims can be found on
   * {@link https://tools.ietf.org/html/rfc7519}
   * under sections 4.1.3 and 4.1.4.
   *
   * @param {Object} opts.payload - The JWT token's payload.
   * @param {number} opts.lifetime - The lifetime of the JWT token in minutes.
   * @return {Object} timestampedPayload
   */
  async timestamp({ payload, lifetime }) {
    const res = { ...payload };
    res.iat = moment().unix();
    if (lifetime) {
      res.exp = moment()
        .add(lifetime, "minutes")
        .unix();
    }
    return res;
  },

  /**
   * Determines if the given JWT token has valid timestamps, i.e.
   * the "exp" claim is not younger than the present instance of time and
   * the "iat" claim is not older than the present instance of time.
   *
   * More information regarding the claims can be found on
   * {@link https://tools.ietf.org/html/rfc7519}
   * under sections 4.1.3 and 4.1.4.
   *
   * @param {Object} payload - The token's payload.
   * @return {boolean} - True if the token is not expired.
   */
  async hasValidTimestamps(payload) {
    const { iat, exp } = payload;
    if (!iat) {
      /* a claim is missing */
      return false;
    }
    if (moment() < moment.unix(iat)) {
      /* token was issued in the future */
      return false;
    }
    if (exp && moment() > moment.unix(exp)) {
      /* token has expired */
      return false;
    }
    return true;
  }
};

export const tokenService = token;
