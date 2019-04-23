/**
 * @file auth routes
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import compose from "koa-compose";
import Router from "koa-router";
import { login } from "./login";
import { refresh } from "./refresh";
import { signup } from "./signup";
import { verify } from "./verify";

export function auth() {
  const router = new Router();

  router.post("/signup", signup());
  router.post("/verify", verify());
  router.post("/login", login());
  router.post("/refresh", refresh());

  return compose([router.routes(), router.allowedMethods()]);
}
