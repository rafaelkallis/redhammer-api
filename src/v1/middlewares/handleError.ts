/**
 * @file error middleware
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { Context } from "koa";
import { config } from "../../config";
import { IClientError, INTERNAL_ERROR, IServerError } from "../errors";
import { log } from "../services";

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
        log.error(String(err));
        const { code, message } = INTERNAL_ERROR();
        ctx.status = 500;
        ctx.body = { error: { code, message } };
      }
    }
  };
}
