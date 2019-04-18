/**
 * @file signup controller
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { Context } from "koa";
import * as moment from "moment";
import * as constants from "../../constants";
import { User } from "../../models";
import * as services from "../../services";
import * as errors from "../errors";

export async function signup({ request, response }: Context) {
  const { email, password, name, address } = request.body;
  if (await User.findOne({ where: { email } })) {
    throw errors.EMAIL_ALREADY_USED_ERROR();
  }
  const id = services.random.id();
  const userId = services.random.id();
  const payload = {
    jti: id,
    sub: userId,
    aud: constants.SIGNUP_TOKEN,
    iat: moment().unix(),
    exp: moment()
      .add(constants.SIGNUP_TOKEN_LIFETIME_MIN, "minutes")
      .unix(),
    email,
    password,
    name,
    address
  };
  const token = await services.token.encrypt(payload);
  await services.email.sendVerifySignup({ to: email, token });
  response.status = 200;
}
