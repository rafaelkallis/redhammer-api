/**
 * @file refresh controller
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as errors from "@errors";
import { post, validate } from "@middlewares";
import { User } from "@models";
import * as services from "@services";
import Joi from "joi";
import { Context } from "koa";
import { IBodyContext } from "koa-bodyparser";

interface IRefreshBody {
  token: string;
}

interface IRefreshContext extends Context<IBodyContext<IRefreshBody>> {}

export const refresh = () =>
  post(
    "/refresh",
    validate.body({ token: Joi.string().required() }),
    async (ctx: IRefreshContext) => {
      const { token } = ctx.request.body;
      let payload;
      try {
        payload = await services.token.verifySignature(token);
      } catch (e) {
        throw new errors.InvalidRefreshTokenError();
      }
      if (!services.token.isRefreshToken(payload)) {
        throw new errors.InvalidRefreshTokenError();
      }
      if (!services.token.hasValidTimestamps(payload)) {
        throw new errors.RefreshTokenExpiredError();
      }
      const { sub } = payload;
      const user = await User.findOne({ where: { id: sub } });
      if (!user) {
        throw new errors.UserNotExistsError();
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
