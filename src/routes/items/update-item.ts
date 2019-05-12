/**
 * @file updateItem controller
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as errors from "@errors";
import {
  authenticate,
  IAuthenticateContext,
  IParamsContext,
  patch,
  validate
} from "@middlewares";
import { Item } from "@models";
import Joi from "joi";
import { Context } from "koa";
import { IBodyContext } from "koa-bodyparser";

interface IUpdateItemBody {
  title?: string;
  tags?: string[];
  image?: string;
}

interface IUpdateItemContext
  extends Context<
    IAuthenticateContext & IBodyContext<IUpdateItemBody> & IParamsContext<"id">
  > {}

export const updateItem = () =>
  patch(
    "/:id",
    validate.params({ id: Joi.string() }),
    validate.body({
      title: Joi.string(),
      tags: Joi.array().items(Joi.string()),
      image: Joi.string()
    }),
    authenticate(),
    async (ctx: IUpdateItemContext) => {
      const item = await Item.findOne({
        where: { id: ctx.request.params.id }
      });
      if (!item) {
        throw new errors.ItemNotFoundError();
      }
      if (ctx.state.user.id !== item.ownerId) {
        throw new errors.UnauthorizedError();
      }
      await item.update(ctx.request.body);
      ctx.response.status = 200;
      ctx.response.body = item;
    }
  );
