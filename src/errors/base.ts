/**
 * @file base errors
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

export abstract class BaseError {
  public abstract status: number;
  public abstract code: string;
  public abstract message: string;

  public toBody(this: BaseError) {
    const { code, message } = this;
    return { error: { code, message } };
  }
}

export abstract class ClientError extends BaseError {
  public status = 400;
}

export abstract class ServerError extends BaseError {
  public status = 500;
}

export class InternalError extends ServerError {
  public code = "internal_error";
  public message = "Request cannot be processed due to an internal error";
}

export class NotImplementedError extends ServerError {
  public status = 501;
  public code = "not_implemented_error";
  public message = "The endpoint has not been implemented yet";
}

export class InternalDatabaseError extends ServerError {
  public code = "internal_database_error";
  public message =
    "Request cannot be processed due to an internal database error";
}

export class UnauthorizedError extends ClientError {
  public status = 401;
  public code = "unauthorized_error";
  public message = "User is not authorized to access the resource";
}
