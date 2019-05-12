/**
 * @file deleteItem controller
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as errors from "@errors";
import {
  authenticate,
  get,
  IAuthenticateContext,
  IParamsContext,
  validate
} from "@middlewares";
import { Item } from "@models";
import Joi from "joi";
import { Context } from "koa";

interface IDeleteContext
  extends Context<IAuthenticateContext & IParamsContext<"id">> {}

export const deleteItem = () =>
  get(
    "/:id",
    validate.params({ id: Joi.string() }),
    authenticate(),
    async (ctx: IDeleteContext) => {
      const item = await Item.findOne({
        where: {
          id: ctx.request.params.id
        }
      });
      if (!item) {
        throw new errors.ItemNotFoundError();
      }
      if (ctx.state.user.id !== item.ownerId) {
        throw new errors.UnauthorizedError();
      }
      await item.destroy();
      ctx.response.status = 200;
    }
  );
