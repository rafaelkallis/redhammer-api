/**
 * @file auth errors
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { ClientErrorFactory } from "./base";

export const EMAIL_ALREADY_USED_ERROR = ClientErrorFactory(
  "email_already_used_error",
  "Provided email is already used by another user"
);

export const INVALID_SIGNUP_TOKEN_ERROR = ClientErrorFactory(
  "invalid_signup_token_error",
  "Provided token is not a valid signup token"
);

export const SIGNUP_TOKEN_EXPIRED_ERROR = ClientErrorFactory(
  "signup_token_expired_error",
  "Provided signup token has expired or was issued in the future"
);

export const EMAIL_NOT_USED_ERROR = ClientErrorFactory(
  "email_not_used_error",
  "Provided email is not used by any user"
);

export const PASSWORD_MISSMATCH_ERROR = ClientErrorFactory(
  "password_missmatch_error",
  "Provided password does not match"
);

export const INVALID_REFRESH_TOKEN_ERROR = ClientErrorFactory(
  "invalid_refresh_token_error",
  "Provided token is not a valid refresh token"
);

export const REFRESH_TOKEN_EXPIRED_ERROR = ClientErrorFactory(
  "refresh_token_expired_error",
  "Provided refresh token has expired or was issued in the future"
);

export const USER_NOT_EXISTS_ERROR = ClientErrorFactory(
  "user_not_exists_error",
  "User with the given id does not exist"
);
