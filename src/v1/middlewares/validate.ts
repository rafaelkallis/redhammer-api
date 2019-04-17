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
  body(schema: Joi.SchemaLike) {
    schema = Joi.compile(schema);
    return async function validateBodyInner(
      ctx: Context,
      next: () => Promise<void>
    ) {
      try {
        ctx.request.body = await Joi.validate(ctx.request.body, schema);
      } catch (error) {
        const clientError: IClientError = {
          isClientError: true,
          code: "req_body_err",
          message: error.details[0].message
        };
        throw clientError;
      }
      await next();
    };
  },

  /**
   * Query validation middleware.
   */
  query(schema: Joi.SchemaLike) {
    schema = Joi.compile(schema);
    return async function validateQueryInner(
      ctx: Context,
      next: () => Promise<void>
    ) {
      try {
        ctx.query = await Joi.validate(ctx.query, schema);
      } catch (error) {
        const clientError: IClientError = {
          isClientError: true,
          code: "req_query_err",
          message: error.details[0].message
        };
        throw clientError;
      }
      await next();
    };
  },

  /**
   * Params validation middleware.
   */
  params(schema: Joi.SchemaLike) {
    schema = Joi.compile(schema);
    return async function validateParamsInner(
      ctx: Context,
      next: () => Promise<void>
    ) {
      try {
        ctx.params = await Joi.validate(ctx.params, schema);
      } catch (error) {
        const clientError: IClientError = {
          isClientError: true,
          code: "req_params_err",
          message: error.details[0].message
        };
        throw clientError;
      }
      await next();
    };
  }
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
