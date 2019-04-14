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
  "/verify",
  validate.body({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
    address: Joi.string().required()
  }),
  authController.verify
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
