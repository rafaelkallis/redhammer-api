/**
 * @file error middleware
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { INTERNAL_ERROR } from "@v1/errors";
import { logService } from "@v1/services";
import { Context } from "koa";

/**
 * Error middleware.
 * Wraps a controller handler in a transaction.
 */
export function handleError() {
  return async function handleErrorInner(
    ctx: Context,
    next: () => Promise<void>
  ) {
    try {
      await next();
    } catch (err) {
      if ("isClientError" in err) {
        const { code, message } = err;
        ctx.status = 400;
        ctx.body = { error: { code, message } };
      } else if ("isServerError" in err) {
        const { code, message } = err;
        ctx.status = 500;
        ctx.body = { error: { code, message } };
      } else {
        logService.error(String(err));
        const { code, message } = INTERNAL_ERROR();
        ctx.status = 500;
        ctx.body = { error: { code, message } };
      }
    }
  };
}
