/**
 * @file login controller
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as errors from "@errors";
import { post, validate } from "@middlewares";
import { User } from "@models";
import * as services from "@services";
import Joi from "joi";
import { Context } from "koa";
import { IBodyContext } from "koa-bodyparser";

interface ILoginBody {
  email: string;
  password: string;
}

interface ILoginContext extends Context<IBodyContext<ILoginBody>> {}

export const login = () =>
  post(
    "/login",
    validate.body({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string().required()
    }),
    async (ctx: ILoginContext) => {
      const { email, password } = ctx.request.body;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new errors.EmailNotUsedError();
      }
      if (!(await services.password.verify(password, user.salt, user.hash))) {
        throw new errors.PasswordMissmatchError();
      }
      const accessTokenPayload = services.token.newAccessToken(user.id);
      const accessToken = await services.token.sign(accessTokenPayload);
      const refreshTokenPayload = services.token.newRefreshToken(user.id);
      const refreshToken = await services.token.sign(refreshTokenPayload);
      ctx.response.status = 200;
      ctx.response.body = {
        accessToken: {
          data: accessToken,
          expiresAt: accessTokenPayload.exp
        },
        refreshToken: {
          data: refreshToken,
          expiresAt: refreshTokenPayload.exp
        }
      };
    }
  );
