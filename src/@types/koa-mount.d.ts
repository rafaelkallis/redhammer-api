/**
 * @file koa-mount types
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

declare module "koa-mount" {
  import { Middleware } from "koa";

  function mount<T>(prefix: string, app: Middleware<T>): Middleware<T>;

  namespace mount {}

  export = mount;
}
