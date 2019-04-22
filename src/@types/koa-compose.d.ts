/**
 * @file koa-compose types
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

declare module "koa-compose" {
  import { IMiddleware } from "koa-router";
  namespace compose {
    type Middleware<T> = (context: T, next: () => Promise<void>) => void;
  }

  function compose<T>(middleware: Array<IMiddleware<T>>): IMiddleware<T>;

  export = compose;
}
