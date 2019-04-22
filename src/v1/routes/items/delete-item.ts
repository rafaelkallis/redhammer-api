/**
 * @file deleteItem controller
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as errors from "@v1/errors";
import { validate } from "@v1/middlewares";
import { Item } from "@v1/models";
import * as Joi from "joi";
import * as compose from "koa-compose";
import { RouterContext } from "koa-router";

export const deleteItem = () =>
  compose([
    validate.params({ id: Joi.string() }),
    async ({ response, state, params }: RouterContext) => {
      const item = await Item.findOne({
        where: {
          id: params.id
        }
      });
      if (!item) {
        throw errors.ITEM_NOT_FOUND_ERROR();
      }
      if (!(await state.user.hasItem(item))) {
        throw errors.USER_NOT_ITEM_OWNER_ERROR();
      }
      await item.destroy();
      response.status = 200;
    }
  ]);
