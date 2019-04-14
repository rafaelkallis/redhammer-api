/**
 * @file auth errors
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { ClientErrorFactory } from "../errors";
export * from "../errors";

export const INVALID_SIGNUP_TOKEN_ERROR = ClientErrorFactory(
  "invalid_signup_token_error",
  "Provided token is not a valid signup token"
);

export const SIGNUP_TOKEN_EXPIRED_ERROR = ClientErrorFactory(
  "signup_token_expired_error",
  "Provided signup token has expired or was issued in the future"
);
