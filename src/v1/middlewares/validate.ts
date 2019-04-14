/**
 * @file validation middleware
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as Joi from "joi";
import { Context } from "koa";
import { IClientError } from "../errors";

export const validate = {
  /**
   * Body validation middleware.
   */
  body: validateRequestProp("body"),

  /**
   * Query validation middleware.
   */
  query: validateRequestProp("query"),

  /**
   * Params validation middleware.
   */
  params: validateRequestProp("params")
};

function validateRequestProp(reqProp: "body" | "query" | "params") {
  return (schema: Joi.SchemaLike) => {
    schema = Joi.compile(schema);
    return async function validateCtxPropInner(
      ctx: Context,
      next: () => Promise<void>
    ) {
      try {
        // assign to context because Joi.validate might transform values
        ctx.request[reqProp] = await Joi.validate(ctx.request[reqProp], schema);
        await next();
      } catch (error) {
        const clientError: IClientError = {
          isClientError: true,
          code: `${reqProp}_err`,
          message: error.details[0].message
        };
        throw clientError;
      }
    };
  };
}
