/**
 * @file log service
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { createLogger, format, transports } from "winston";
import { config } from "../../config";

const logger = createLogger({
  level: "info",
  transports: [
    new transports.Console({
      format: format.combine(format.colorize({ all: true }), format.simple())
    })
  ]
});

const log = {
  debug(arg: string, ...rest: string[]) {
    logger.debug(arg, ...rest);
  },

  info(arg: string, ...rest: string[]) {
    logger.info(arg, ...rest);
  },

  warn(arg: string, ...rest: string[]) {
    logger.warn(arg, ...rest);
  },

  error(arg: string, ...rest: string[]) {
    logger.error(arg, ...rest);
  }
};

const logService = log;

export { log, logService };
