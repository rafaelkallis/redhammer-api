/**
 * @file auth errors
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { ClientError } from "./base";

export class EmailNotUsedError extends ClientError {
  public code = "email_not_used_error";
  public message = "Provided email is not used by any user";
}

export class EmailAlreadyUsedError extends ClientError {
  public code = "email_already_used_error";
  public message = "Provided email is already used by another user";
}

export class PasswordMissmatchError extends ClientError {
  public code = "password_missmatch_error";
  public message = "Provided password does not match";
}

export class InvalidRefreshTokenError extends ClientError {
  public code = "invalid_refresh_token_error";
  public message = "Provided token is not a valid refresh token";
}

export class RefreshTokenExpiredError extends ClientError {
  public code = "refresh_token_expired_error";
  public message = "Provided refresh token has expired";
}

export class UserNotExistsError extends ClientError {
  public code = "user_not_exists_error";
  public message = "User with the given id does not exist";
}

export class InvalidSignupTokenError extends ClientError {
  public code = "invalid_signup_token_error";
  public message = "Provided token is not a valid signup token";
}

export class SignupTokenExpiredError extends ClientError {
  public code = "signup_token_expired_error";
  public message = "Provided signup token has expired";
}
