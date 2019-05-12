/**
 * @file auth routes
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import compose from "koa-compose";
import { login } from "./login";
import { refresh } from "./refresh";
import { signup } from "./signup";
import { verify } from "./verify";

export const auth = () => compose([login(), refresh(), signup(), verify()]);
