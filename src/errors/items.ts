/**
 * @file item errors
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { ClientError } from "./base";

export class ItemNotFoundError extends ClientError {
  public code = "item_not_found_error";
  public message = "Item with given id does not exist";
}

export class InvalidImageError extends ClientError {
  public code = "invalid_image_error";
  public message = "Provided image is not valid";
}
