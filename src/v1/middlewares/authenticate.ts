/**
 * @file authentication middleware
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as constants from "@v1/constants";
import * as errors from "@v1/errors";
import { User } from "@v1/models";
import * as services from "@v1/services";
import { Context } from "koa";

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
    let payload;
    try {
      payload = await services.token.verifySignature(authorizationHeader);
    } catch (e) {
      throw errors.UNAUTHORIZED_USER_ERROR();
    }
    if (!services.token.hasValidTimestamps(payload)) {
      throw errors.UNAUTHORIZED_USER_ERROR();
    }
    if (!services.token.isAccessToken(payload)) {
      throw errors.UNAUTHORIZED_USER_ERROR();
    }
    const user = await User.findOne({ where: { id: payload.sub } });
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
