/**
 * @file authentication middleware
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as constants from "@constants";
import * as errors from "@errors";
import { User } from "@models";
import * as services from "@services";
import { Middleware } from "koa";

export interface IAuthenticateContext {
  state: { user: User };
}

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
export function authenticate<T>(): Middleware<IAuthenticateContext & T> {
  return async function authenticateInner(ctx, next) {
    const authorizationHeader =
      ctx.request.headers[constants.ACCESS_TOKEN_HEADER];
    if (!authorizationHeader) {
      throw new errors.UnauthorizedError();
    }
    let payload;
    try {
      payload = await services.token.verifySignature(authorizationHeader);
    } catch (e) {
      throw new errors.UnauthorizedError();
    }
    if (!services.token.hasValidTimestamps(payload)) {
      throw new errors.UnauthorizedError();
    }
    if (!services.token.isAccessToken(payload)) {
      throw new errors.UnauthorizedError();
    }
    const user = await User.findOne({ where: { id: payload.sub } });
    if (!user) {
      throw new errors.UnauthorizedError();
    }
    ctx.state.user = user;
    await next();
  };
}
