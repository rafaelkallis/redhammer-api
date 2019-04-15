/**
 * @file item errors
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { ClientErrorFactory } from "../errors";
export * from "../errors";

export const USER_NOT_ITEM_OWNER_ERROR = ClientErrorFactory(
  "user_not_item_owner_error",
  "User is not the owner of the given item"
);
