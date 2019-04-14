/**
 * @file auth controller
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { Context } from "koa";
import * as services from "../services";
import { TokenType } from "./constants";
import * as errors from "./errors";

export const authController = {
  /**
   */
  async signup({ request, response }: Context) {
    const { email, password, name, address } = request.body;
    const id = services.random.id();
    let payload = {
      id,
      type: TokenType.SIGNUP,
      email,
      password,
      name,
      address
    };
    const lifetime = 20;
    payload = services.token.timestamp({ payload, lifetime });
    const token = await services.token.encrypt(payload);
    await services.email.sendVerifySignup({ to: email, token });
  },
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
    const { type } = payload;
    if (type !== TokenType.SIGNUP) {
      throw errors.INVALID_SIGNUP_TOKEN_ERROR();
    }
    const { id, email, password, name, address } = payload;
    const salt = services.password.genSalt();
    const hash = await services.password.hash(password, salt);
    // TODO: insert to db
    throw errors.UNIMPLEMENTED_ERROR();
  },
  /**
   */
  async login({ request, response }: Context) {
    throw errors.UNIMPLEMENTED_ERROR();
    const { email, password } = request.body;
  }
};
