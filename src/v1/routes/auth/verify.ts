/**
 * @file verify auth controller
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as errors from "@v1/errors";
import { validate } from "@v1/middlewares";
import { User } from "@v1/models";
import * as services from "@v1/services";
import Joi from "joi";
import compose from "koa-compose";
import { RouterContext } from "koa-router";

export const verify = () =>
  compose([
    validate.query({ token: Joi.string().required() }),
    async ({ request, response }: RouterContext) => {
      const { token } = request.query;
      let payload;
      try {
        payload = await services.token.decrypt(token);
      } catch (e) {
        throw errors.INVALID_SIGNUP_TOKEN_ERROR();
      }
      if (!services.token.hasValidTimestamps(payload)) {
        throw errors.SIGNUP_TOKEN_EXPIRED_ERROR();
      }
      if (!services.token.isSignupToken(payload)) {
        throw errors.INVALID_SIGNUP_TOKEN_ERROR();
      }
      const { sub, email, password, name, address } = payload;
      if (await User.findOne({ where: { email } })) {
        throw errors.EMAIL_ALREADY_USED_ERROR();
      }
      const user = User.build({ id: sub, email, name, address });
      user.salt = services.password.genSalt();
      user.hash = await services.password.hash(password, user.salt);
      await user.save();
      response.status = 200;
      response.body = user.toJSON();
    }
  ]);
