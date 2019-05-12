/**
 * @file koa-compress types
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

declare module "koa-compress" {
  import * as Koa from "koa";
  import * as zlib from "zlib";

  /**
   * Compress middleware for Koa
   */
  function koaCompress<T>(
    options?: koaCompress.ICompressOptions
  ): Koa.Middleware<T>;

  export = koaCompress;

  namespace koaCompress {
    interface ICompressOptions extends zlib.ZlibOptions {
      /**
       * An optional function that checks the response content type to decide whether to compress. By default, it uses compressible.
       */
      filter?: (contentType: string) => boolean;

      /**
       * Minimum response size in bytes to compress. Default 1024 bytes or 1kb.
       */
      threshold?: number;
    }
  }
}
