/**
 * @file getItems controller
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import {
  authenticate,
  get,
  IAuthenticateContext,
  validate
} from "@middlewares";
import { Item } from "@models";
import { Context } from "koa";

interface IGetItemsContext extends Context<IAuthenticateContext> {}

export const getItems = () =>
  get(
    "/",
    validate.query({}),
    authenticate(),
    async (ctx: IGetItemsContext) => {
      const items = await Item.findAll({ limit: 20 });
      ctx.response.status = 200;
      ctx.response.body = items;
    }
  );
