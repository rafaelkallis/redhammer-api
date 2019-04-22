/**
 * @file signup controller
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as errors from "@v1/errors";
import { validate } from "@v1/middlewares";
import { User } from "@v1/models";
import * as services from "@v1/services";
import * as Joi from "joi";
import * as compose from "koa-compose";
import { RouterContext } from "koa-router";

export const signup = () =>
  compose([
    validate.body({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string().required(),
      name: Joi.string().required(),
      address: Joi.string().required()
    }),
    async ({ request, response }: RouterContext) => {
      const { email, password, name, address } = request.body;
      if (await User.findOne({ where: { email } })) {
        throw errors.EMAIL_ALREADY_USED_ERROR();
      }
      const userId = services.random.ordered();
      const payload = services.token.newSignupToken({
        sub: userId,
        email,
        password,
        name,
        address
      });
      const token = await services.token.encrypt(payload);
      await services.email.sendVerifySignup({ to: email, token });
      response.status = 200;
    }
  ]);
