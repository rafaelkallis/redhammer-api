/**
 * @file validation middleware
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { BaseError, ClientError } from "@errors";
import Joi from "joi";
import { IRequest, Middleware } from "koa";

export class RequestBodyValidationError extends ClientError {
  public code = "request_body_validation_error";
  public constructor(public message: string) {
    super();
  }
}

export class RequestQueryValidationError extends ClientError {
  public code = "request_query_validation_error";
  public constructor(public message: string) {
    super();
  }
}

export class RequestParamsValidationError extends ClientError {
  public code = "request_params_validation_error";
  public constructor(public message: string) {
    super();
  }
}

export const validate = {
  /**
   * Body validation middleware.
   */
  body: validateRequestProp("body", RequestBodyValidationError),

  /**
   * Query validation middleware.
   */
  query: validateRequestProp("query", RequestQueryValidationError),

  /**
   * Params validation middleware.
   */
  params: validateRequestProp("params", RequestParamsValidationError)
};

type IErrorConstructor = new (message: string) => BaseError;

function validateRequestProp(
  prop: keyof IRequest,
  ErrorConstructor: IErrorConstructor
) {
  return <T>(schema: Joi.SchemaLike): Middleware<T> => {
    schema = Joi.compile(schema);
    return async function validateRequestPropInner(ctx, next) {
      try {
        // assign to request's body because Joi.validate might transform values
        ctx.request[prop] = await Joi.validate(ctx.request[prop], schema);
      } catch (error) {
        throw new ErrorConstructor(error.details[0].message);
      }
      await next();
    };
  };
}
