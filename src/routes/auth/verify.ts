/**
 * @file verify auth controller
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as errors from "@errors";
import { post, validate } from "@middlewares";
import { User } from "@models";
import * as services from "@services";
import Joi from "joi";
import { Context } from "koa";
import { IBodyContext } from "koa-bodyparser";

interface IVerifyBody {
  token: string;
}

interface IVerifyContext extends Context<IBodyContext<IVerifyBody>> {}

export const verify = () =>
  post(
    "/verify",
    validate.query({ token: Joi.string().required() }),
    async (ctx: IVerifyContext) => {
      const { token } = ctx.request.body;
      let payload;
      try {
        payload = await services.token.decrypt(token);
      } catch (e) {
        throw new errors.InvalidSignupTokenError();
      }
      if (!services.token.hasValidTimestamps(payload)) {
        throw new errors.SignupTokenExpiredError();
      }
      if (!services.token.isSignupToken(payload)) {
        throw new errors.InvalidSignupTokenError();
      }
      const { sub, email, password, name, address } = payload;
      if (await User.findOne({ where: { email } })) {
        throw new errors.EmailAlreadyUsedError();
      }
      const passwordSalt = services.password.genSalt();
      const passwordHash = await services.password.hash(password, passwordSalt);
      const user = await User.create({
        id: sub,
        email,
        name,
        address,
        passwordSalt,
        passwordHash
      });
      ctx.response.status = 200;
      ctx.response.body = user.toJSON();
    }
  );
