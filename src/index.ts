/**
 * @file index
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { server } from "@app";
import exitHook from "exit-hook";
import { config } from "./config";

server.listen(config.PORT);

exitHook(() => {
  server.close();
});
