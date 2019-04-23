/**
 * @file item router
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import compose from "koa-compose";
import Router from "koa-router";
import { addItem } from "./add-item";
import { deleteItem } from "./delete-item";
import { getItems } from "./get-items";
import { updateItem } from "./update-item";

export function items() {
  const router = new Router();

  router.get("/", getItems());
  router.post("/", addItem());
  router.patch("/:id", updateItem());
  router.delete("/:id", deleteItem());

  return compose([router.routes(), router.allowedMethods()]);
}
