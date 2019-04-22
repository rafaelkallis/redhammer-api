/**
 * @file types
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { ACCESS_TOKEN, REFRESH_TOKEN, SIGNUP_TOKEN } from "@v1/constants";

export interface ITokenBase {
  jti: string;
  aud: string;
  sub: string;
  iat: number;
  exp: number;
}

export interface ISignupToken extends ITokenBase {
  aud: typeof SIGNUP_TOKEN;
  email: string;
  password: string;
  name: string;
  address: string;
}

export interface IAccessToken extends ITokenBase {
  aud: typeof ACCESS_TOKEN;
}

export interface IRefreshToken extends ITokenBase {
  aud: typeof REFRESH_TOKEN;
}
