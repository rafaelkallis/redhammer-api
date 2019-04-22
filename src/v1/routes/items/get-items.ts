/**
 * @file getItems controller
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { validate } from "@v1/middlewares";
import { Item } from "@v1/models";
import * as compose from "koa-compose";
import { RouterContext } from "koa-router";

export const getItems = () =>
  compose([
    validate.query({}),
    async ({ response }: RouterContext) => {
      const items = await Item.findAll();
      response.status = 200;
      response.body = items.map(item => item.toJSON());
    }
  ]);
