/**
 * @file login controller
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as errors from "@v1/errors";
import { validate } from "@v1/middlewares";
import { User } from "@v1/models";
import * as services from "@v1/services";
import Joi from "joi";
import compose from "koa-compose";
import { RouterContext } from "koa-router";

export const login = () =>
  compose([
    validate.body({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string().required()
    }),
    async ({ request, response }: RouterContext) => {
      const { email, password } = request.body;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw errors.EMAIL_NOT_USED_ERROR();
      }
      if (!(await services.password.verify(password, user.salt, user.hash))) {
        throw errors.PASSWORD_MISSMATCH_ERROR();
      }
      const accessTokenPayload = services.token.newAccessToken(user.id);
      const accessToken = await services.token.sign(accessTokenPayload);
      const refreshTokenPayload = services.token.newRefreshToken(user.id);
      const refreshToken = await services.token.sign(refreshTokenPayload);
      response.status = 200;
      response.body = {
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
  ]);
