/**
 * @file authentication middleware
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { Context } from "koa";
import * as constants from "../constants";
import { ClientErrorFactory } from "../errors";
import * as errors from "../errors";
import { User } from "../models";
import * as services from "../services";

/**
 * Authorize the request.
 * Verifies the bearer token provided in the headers.
 * Injects the decoded token in the request object.
 *
 * @example
 * ```js
 * const router = express.Router();
 *
 * router.post('/users', transact(), authorize(), (req, res) => {
 *   // decoded access token is injected
 *   const { accessToken } = req;
 * });
 * ```
 * @returns {Function} authorizationMiddleware
 */
export function authenticate() {
  return async function authenticateInner(
    { request, state }: Context,
    next: () => Promise<void>
  ) {
    const authorizationHeader = request.headers[constants.ACCESS_TOKEN_HEADER];
    if (!authorizationHeader) {
      throw errors.UNAUTHORIZED_USER_ERROR();
    }
    let accessToken;
    try {
      accessToken = await services.token.verifySignature(authorizationHeader);
    } catch (e) {
      throw errors.UNAUTHORIZED_USER_ERROR();
    }
    if (!services.token.hasValidTimestamps(accessToken)) {
      throw errors.UNAUTHORIZED_USER_ERROR();
    }
    if (accessToken.aud !== constants.ACCESS_TOKEN) {
      throw errors.UNAUTHORIZED_USER_ERROR();
    }
    const user = User.findOne({ where: { id: accessToken.sub } });
    if (!user) {
      throw errors.UNAUTHORIZED_USER_ERROR();
    }
    state.user = user;
    await next();
  };
}

declare module "koa" {
  // tslint:disable-next-line:interface-name
  interface Context {
    state: {
      user: User;
    };
  }
}