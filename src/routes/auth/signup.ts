/**
 * @file signup controller
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as errors from "@errors";
import { post, validate } from "@middlewares";
import { User } from "@models";
import * as services from "@services";
import Joi from "joi";
import { Context } from "koa";
import { IBodyContext } from "koa-bodyparser";

interface ISignupBody {
  email: string;
  password: string;
  name: string;
  address: string;
}

interface ISignupContext extends Context<IBodyContext<ISignupBody>> {}

export const signup = () =>
  post(
    "/signup",
    validate.body({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string().required(),
      name: Joi.string().required(),
      address: Joi.string().required()
    }),
    async (ctx: ISignupContext) => {
      const { email, password, name, address } = ctx.request.body;
      if (await User.findOne({ where: { email } })) {
        throw new errors.EmailNotUsedError();
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
      ctx.response.status = 200;
    }
  );
