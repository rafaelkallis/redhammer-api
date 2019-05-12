/**
 * @file koa-helmet types
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

declare module "koa-helmet" {
  import {
    IHelmetConfiguration,
    IHelmetDnsPrefetchControlConfiguration,
    IHelmetFrameguardConfiguration,
    IHelmetHpkpConfiguration,
    IHelmetHstsConfiguration,
    IHelmetReferrerPolicyConfiguration,
    IHelmetXssFilterConfiguration
  } from "helmet";
  import { Context, Middleware } from "koa";

  namespace koaHelmet {
    type KoaHelmetContentSecurityPolicyDirectiveFunction = (
      ctx: Context
    ) => string;

    type KoaHelmetCspDirectiveValue =
      | string
      | KoaHelmetContentSecurityPolicyDirectiveFunction;

    interface IKoaHelmetContentSecurityPolicyDirectives {
      baseUri?: KoaHelmetCspDirectiveValue[];
      childSrc?: KoaHelmetCspDirectiveValue[];
      connectSrc?: KoaHelmetCspDirectiveValue[];
      defaultSrc?: KoaHelmetCspDirectiveValue[];
      fontSrc?: KoaHelmetCspDirectiveValue[];
      formAction?: KoaHelmetCspDirectiveValue[];
      frameAncestors?: KoaHelmetCspDirectiveValue[];
      frameSrc?: KoaHelmetCspDirectiveValue[];
      imgSrc?: KoaHelmetCspDirectiveValue[];
      mediaSrc?: KoaHelmetCspDirectiveValue[];
      objectSrc?: KoaHelmetCspDirectiveValue[];
      pluginTypes?: KoaHelmetCspDirectiveValue[];
      reportUri?: string;
      sandbox?: KoaHelmetCspDirectiveValue[];
      scriptSrc?: KoaHelmetCspDirectiveValue[];
      styleSrc?: KoaHelmetCspDirectiveValue[];
    }

    interface IKoaHelmetContentSecurityPolicyConfiguration {
      reportOnly?: boolean;
      setAllHeaders?: boolean;
      disableAndroid?: boolean;
      browserSniff?: boolean;
      directives?: IKoaHelmetContentSecurityPolicyDirectives;
    }

    interface IKoaHelmet {
      <T>(options?: IHelmetConfiguration): Middleware<T>;

      contentSecurityPolicy<T>(
        options?: IKoaHelmetContentSecurityPolicyConfiguration
      ): Middleware<T>;

      dnsPrefetchControl<T>(
        options?: IHelmetDnsPrefetchControlConfiguration
      ): Middleware<T>;

      frameguard<T>(options?: IHelmetFrameguardConfiguration): Middleware<T>;

      hpkp<T>(options?: IHelmetHpkpConfiguration): Middleware<T>;

      hsts<T>(options?: IHelmetHstsConfiguration): Middleware<T>;

      ieNoOpen<T>(): Middleware<T>;

      noCache<T>(): Middleware<T>;

      noSniff<T>(): Middleware<T>;

      referrerPolicy<T>(
        options?: IHelmetReferrerPolicyConfiguration
      ): Middleware<T>;

      xssFilter<T>(options?: IHelmetXssFilterConfiguration): Middleware<T>;
    }
  }

  const koaHelmet: koaHelmet.IKoaHelmet;

  export = koaHelmet;
}
