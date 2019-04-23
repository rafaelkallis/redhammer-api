/**
 * @file updateItem controller
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as errors from "@v1/errors";
import { validate } from "@v1/middlewares";
import { Item } from "@v1/models";
import Joi from "joi";
import compose from "koa-compose";
import { RouterContext } from "koa-router";

export const updateItem = () =>
  compose([
    validate.params({ id: Joi.string() }),
    validate.body({
      title: Joi.string(),
      tags: Joi.array().items(Joi.string()),
      image: Joi.string()
    }),
    async ({ request, response, state, params }: RouterContext) => {
      const item = await Item.findOne({
        where: { id: params.id }
      });
      if (!item) {
        throw errors.ITEM_NOT_FOUND_ERROR();
      }
      if (!(await state.user.hasItem(item))) {
        throw errors.USER_NOT_ITEM_OWNER_ERROR();
      }
      await item.update(request.body);
      response.status = 200;
      response.body = item.toJSON();
    }
  ]);
