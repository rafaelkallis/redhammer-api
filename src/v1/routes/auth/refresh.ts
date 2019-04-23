/**
 * @file refresh controller
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as errors from "@v1/errors";
import { validate } from "@v1/middlewares";
import { User } from "@v1/models";
import * as services from "@v1/services";
import Joi from "joi";
import compose from "koa-compose";
import { RouterContext } from "koa-router";

export const refresh = () =>
  compose([
    validate.body({ token: Joi.string().required() }),
    async ({ request, response }: RouterContext) => {
      const { token } = request.body;
      let payload;
      try {
        payload = await services.token.verifySignature(token);
      } catch (e) {
        throw errors.INVALID_REFRESH_TOKEN_ERROR();
      }
      if (!services.token.isRefreshToken(payload)) {
        throw errors.INVALID_REFRESH_TOKEN_ERROR();
      }
      if (!services.token.hasValidTimestamps(payload)) {
        throw errors.REFRESH_TOKEN_EXPIRED_ERROR();
      }
      const { sub } = payload;
      const user = await User.findOne({ where: { id: sub } });
      if (!user) {
        throw errors.USER_NOT_EXISTS_ERROR();
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
