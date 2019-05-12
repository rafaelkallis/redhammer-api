/**
 * @file error middleware
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as errors from "@errors";
import * as services from "@services";
import { Middleware } from "koa";

/**
 * Error middleware.
 * Wraps a controller handler in a transaction.
 */
export function handleError<T>(): Middleware<T> {
  return async function handleErrorInner(ctx, next) {
    try {
      await next();
    } catch (error) {
      if (!(error instanceof errors.BaseError)) {
        const { method, originalUrl } = ctx.request;
        services.log.error(`${method} ${originalUrl}\n${error.message}`);
        error = new errors.InternalError();
      }
      ctx.response.status = error.status;
      ctx.response.body = error.toBody();
    }
  };
}
