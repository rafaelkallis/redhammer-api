/**
 * @file koa-bodyparser types
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

declare module "koa-bodyparser" {
  import { Middleware } from "koa";

  function bodyParser<T>(opts?: bodyParser.IOptions): Middleware<T>;

  namespace bodyParser {
    interface IOptions {
      /**
       *  parser will only parse when request type hits enableTypes, default is ['json', 'form'].
       */
      enableTypes?: string[];
      /**
       * requested encoding. Default is utf-8 by co-body
       */
      encode?: string;

      /**
       * limit of the urlencoded body. If the body ends up being larger than this limit
       * a 413 error code is returned. Default is 56kb
       */
      formLimit?: string;

      /**
       * limit of the json body. Default is 1mb
       */
      jsonLimit?: string;

      /**
       * limit of the text body. Default is 1mb.
       */
      textLimit?: string;

      /**
       * when set to true, JSON parser will only accept arrays and objects. Default is true
       */
      strict?: boolean;

      /**
       * support extend types
       */
      extendTypes?: {
        json?: string[];
        form?: string[];
        text?: string[];
      };
    }

    interface IBodyContext<B extends object> {
      request: {
        body: B;
      };
    }
  }

  export = bodyParser;
}
