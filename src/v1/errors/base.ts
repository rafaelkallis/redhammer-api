/**
 * @file base errors
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

export interface IClientError {
  isClientError: true;
  code: string;
  message: string;
}

export interface IServerError {
  isServerError: true;
  code: string;
  message: string;
}

export const ClientErrorFactory = (
  code: string,
  message: string
) => (): IClientError => ({
  isClientError: true,
  code,
  message
});

export const ServerErrorFactory = (
  code: string,
  message: string
) => (): IServerError => ({
  isServerError: true,
  code,
  message
});

export const INTERNAL_ERROR = ServerErrorFactory(
  "internal_error",
  "Request cannot be processed due to an internal error"
);

export const UNIMPLEMENTED_ERROR = ServerErrorFactory(
  "unimplemented_error",
  "The endpoint has not been implemented yet"
);

export const INTERNAL_DATABASE_ERROR = ServerErrorFactory(
  "internal_database_error",
  "Request cannot be processed due to an internal database error"
);

export const UNAUTHORIZED_USER_ERROR = ClientErrorFactory(
  "unauthorized_user_error",
  "User is not authorized to access the resource"
);
