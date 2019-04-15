/**
 * @file db
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { Op, Sequelize } from "sequelize";
import { config } from "../config";
import { log } from "./services";

export const sequelize = new Sequelize(config.DATABASE_URL, {
  dialect: "postgres",
  logging:
    config.NODE_ENV === "production"
      ? false
      : (param: string) => log.debug(param)
});

(async () => {
  try {
    // await sequelize.sync()
    await sequelize.authenticate();
    log.info("DB connection has been established successfully.");
  } catch (e) {
    log.error("Unable to connect to the database:", e);
    process.exit(1);
  }
})();
