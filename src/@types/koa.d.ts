/**
 * @file koa types
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

declare module "koa" {
  import * as accepts from "accepts";
  import * as Cookies from "cookies";
  import { IncomingMessage, Server, ServerResponse } from "http";
  import { Http2ServerRequest, Http2ServerResponse } from "http2";
  import * as url from "url";

  class Application {
    public env: string;
    public proxy: boolean;

    /**
     * Use the given middleware `fn`.
     *
     * Old-style middleware will be converted.
     */
    public use<T>(middleware: Application.Middleware<T>): Application;

    /**
     * Return a request handler callback
     * for node's native http/http2 server.
     */
    public callback(): (
      req: IncomingMessage | Http2ServerRequest,
      res: ServerResponse | Http2ServerResponse
    ) => void;
  }

  namespace Application {
    interface IRequest {
      body: object;
      params: object;
      query: object;
      header: any;
      headers: any;
      secure: boolean;
      originalUrl: string;
      ip: string;
      ips: string[];
      accept: accepts.Accepts;
      charset: string;
      type: string;
      url: string;
      origin: string;
      href: string;
      method: string;
      path: string;
      search: string;
      host: string;
      hostname: string;
      URL: url.URL;
      fresh: boolean;
      stale: boolean;
      idempotent: boolean;
      subdomains: string[];
    }

    interface IResponse {
      body: any;
      status: number;
      message: string;
      length: number;
      headerSent: boolean;
      type: string;
      lastModified: Date;
      etag: string;
      writable: boolean;
      header: any;
      headers: any;
      redirect(url: string, alt?: string): void;
      attachment(filename: string): void;
      flushHeaders(): void;
    }

    type Context<T = {}> = {
      request: IRequest;
      response: IResponse;
      /* req: IncomingMessage; */
      /* res: ServerResponse; */
      cookies: Cookies;
      state: {};
    } & T;

    type Middleware<T = {}> = (
      ctx: Context<T>,
      next: () => Promise<void>
    ) => void | Promise<void>;

    interface IQueryContext<Q extends string> {
      request: {
        query: Record<Q, string>;
      };
    }
  }

  export = Application;
}
