/**
 * @file koa-mount types
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

declare module "koa-mount" {
  import * as Koa from "koa";
  import * as Router from "koa-router";

  namespace mount {}

  function mount<StateT = any>(
    prefix: string,
    app: Koa.Middleware<StateT> | Router.IMiddleware<StateT> | Koa
  ): Koa.Middleware<StateT>;

  export = mount;
}
