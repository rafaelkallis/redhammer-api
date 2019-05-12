/**
 * @file item router
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import compose from "koa-compose";
import { addItem } from "./add-item";
import { deleteItem } from "./delete-item";
import { getItems } from "./get-items";
import { updateItem } from "./update-item";

export const items = () =>
  compose([getItems(), addItem(), deleteItem(), updateItem(), deleteItem()]);
