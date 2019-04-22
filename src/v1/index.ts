/**
 * @file v1 index
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { authenticate, handleError } from "@v1/middlewares";
import * as compose from "koa-compose";
import * as mount from "koa-mount";
import { auth, items } from "./routes";

export function v1() {
  return compose([
    handleError(),
    mount("/auth", auth()),
    authenticate(),
    mount("/items", items())
  ]);
}
