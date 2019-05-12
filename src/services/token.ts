/**
 * @file token service
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { config } from "@config";
import * as constants from "@constants";
import { IAccessToken, IRefreshToken, ISignupToken, ITokenBase } from "@types";
import base64url from "base64url";
import moment from "moment";
import jose from "node-jose";
import { randomService } from "./random";

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
  k: base64url.encode(jwkSecretBuffer)
});

const token = {
  /**
   * Signs the given payload and returns a JWT.
   *
   * @param {Object} payload - The payload to sign.
   * @return {Promise<string>} - A signed json web token.
   */
  async sign(payload: ITokenBase): Promise<string> {
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
  async verifySignature(jwt: string): Promise<ITokenBase> {
    const { payload } = await jose.JWS.createVerify(await jwk).verify(jwt);
    return JSON.parse(payload.toString("utf8"));
  },

  /**
   * Encrypts the given payload and returns a JWT.
   * @param {Object} payload - The payload to encrypt.
   * @return {Promise<string>} - An encrypted json web token.
   */
  async encrypt(payload: ITokenBase): Promise<string> {
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
  async decrypt(jwe: string): Promise<ITokenBase> {
    const { payload } = await jose.JWE.createDecrypt(await jwk).decrypt(jwe);
    return JSON.parse(payload.toString("utf8"));
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
  hasValidTimestamps(payload: Partial<ITokenBase>) {
    const { iat, exp } = payload;
    if (!iat) {
      /* a claim is missing */
      return false;
    }
    if (moment() < moment.unix(iat)) {
      /* token was issued in the future */
      return false;
    }
    if (!exp) {
      /* a claim is missing */
      return false;
    }
    if (moment() > moment.unix(exp)) {
      /* token has expired */
      return false;
    }
    return true;
  },

  newSignupToken(params: {
    sub: string;
    email: string;
    password: string;
    name: string;
    address: string;
  }): ISignupToken {
    const { sub, email, password, name, address } = params;
    return {
      jti: randomService.unordered(),
      sub,
      aud: constants.SIGNUP_TOKEN,
      iat: moment().unix(),
      exp: moment()
        .add(constants.SIGNUP_TOKEN_LIFETIME_MIN, "minutes")
        .unix(),
      email,
      password,
      name,
      address
    };
  },

  isSignupToken(payload: any): payload is ISignupToken {
    return payload.aud === constants.SIGNUP_TOKEN;
  },

  newAccessToken(sub: string): IAccessToken {
    return {
      jti: randomService.unordered(),
      aud: constants.ACCESS_TOKEN,
      sub,
      iat: moment().unix(),
      exp: moment()
        .add(constants.ACCESS_TOKEN_LIFETIME_MIN, "minutes")
        .unix()
    };
  },

  isAccessToken(payload: any): payload is ISignupToken {
    return payload.aud === constants.ACCESS_TOKEN;
  },

  newRefreshToken(sub: string): IRefreshToken {
    return {
      jti: randomService.unordered(),
      aud: constants.REFRESH_TOKEN,
      sub,
      iat: moment().unix(),
      exp: moment()
        .add(constants.REFRESH_TOKEN_LIFETIME_MIN, "minutes")
        .unix()
    };
  },

  isRefreshToken(payload: any): payload is ISignupToken {
    return payload.aud === constants.REFRESH_TOKEN;
  }
};

const tokenService = token;

export { token, tokenService };
