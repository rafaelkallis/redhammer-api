/**
 * @file getItem controller
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import {
  authenticate,
  get,
  IAuthenticateContext,
  IParamsContext,
  validate
} from "@middlewares";
import { Item } from "@models";
import * as Joi from "joi";
import { Context } from "koa";

interface IGetItemContext
  extends Context<IAuthenticateContext & IParamsContext<"id">> {}

export const getItem = () =>
  get(
    "/",
    validate.params({ id: Joi.string().required() }),
    authenticate(),
    async (ctx: IGetItemContext) => {
      const item = await Item.findOne({ where: { id: ctx.request.params.id } });
      ctx.response.status = 200;
      ctx.response.body = item;
    }
  );
