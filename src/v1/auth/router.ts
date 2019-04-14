/**
 * @file auth router
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as Joi from "joi";
import * as Router from "koa-router";
import { validate } from "../middlewares";
import { authController } from "./controller";

export const authRouter = new Router();

authRouter.post(
  "/signup",
  validate.body({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
    address: Joi.string().required()
  }),
  authController.signup
);

authRouter.post(
  "/signup",
  validate.query({ token: Joi.string().required() }),
  authController.signup
);

authRouter.post(
  "/login",
  validate.body({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().required()
  }),
  authController.login
);

authRouter.post(
  "/refresh",
  validate.body({ token: Joi.string().required() }),
  authController.refresh
);
