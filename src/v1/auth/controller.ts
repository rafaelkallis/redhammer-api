/**
 * @file auth controller
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { Context } from "koa";
import * as errors from "../errors";

export const authController = {
  /**
   */
  async login(ctx: Context) {
    throw errors.UNIMPLEMENTED_ERROR();
  },
  /**
   */
  async signup(ctx: Context) {
    throw errors.UNIMPLEMENTED_ERROR();
  },
  /**
   */
  async verify(ctx: Context) {
    throw errors.UNIMPLEMENTED_ERROR();
  }
};
