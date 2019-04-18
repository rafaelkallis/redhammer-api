/**
 * @file item router
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as Joi from "joi";
import * as Router from "koa-router";
import { validate } from "../middlewares";
import { itemController } from "./controller";

export const itemRouter = new Router();

itemRouter.get("/", validate.query({}), itemController.getItems);

itemRouter.post(
  "/",
  validate.body({
    title: Joi.string().required(),
    tags: Joi.array()
      .items(Joi.string())
      .required(),
    image: Joi.string().required()
  }),
  itemController.addItem
);

itemRouter.patch(
  "/:id",
  validate.params({ id: Joi.string() }),
  validate.body({
    title: Joi.string(),
    tags: Joi.array().items(Joi.string()),
    image: Joi.string()
  }),
  itemController.patchItem
);

itemRouter.delete(
  "/:id",
  validate.params({ id: Joi.string() }),
  itemController.deleteItem
);
