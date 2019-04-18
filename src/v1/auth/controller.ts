/**
 * @file auth controller
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { Context } from "koa";
import * as moment from "moment";
import * as constants from "../constants";
import { User } from "../models";
import * as services from "../services";
import * as errors from "./errors";

export const authController = {
  /**
   */
  async verify({ request, response }: Context) {
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
    const { aud } = payload;
    if (aud !== constants.SIGNUP_TOKEN) {
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
  },

  /**
   */
  async login({ request, response }: Context) {
    const { email, password } = request.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw errors.EMAIL_NOT_USED_ERROR();
    }
    if (!(await services.password.verify(password, user.salt, user.hash))) {
      throw errors.PASSWORD_MISSMATCH_ERROR();
    }
    const {
      accessToken,
      accessTokenPayload
    } = await services.token.createAccessToken(user.id);
    const {
      refreshToken,
      refreshTokenPayload
    } = await services.token.createRefreshToken(user.id);

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
  },

  /**
   */
  async refresh({ request, response }: Context) {
    const { token } = request.body;
    let payload;
    try {
      payload = await services.token.verifySignature(token);
    } catch (e) {
      throw errors.INVALID_REFRESH_TOKEN_ERROR();
    }
    const { aud } = payload;
    if (aud !== constants.REFRESH_TOKEN) {
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
    const {
      accessToken,
      accessTokenPayload
    } = await services.token.createAccessToken(user.id);
    const {
      refreshToken,
      refreshTokenPayload
    } = await services.token.createRefreshToken(user.id);
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
};
