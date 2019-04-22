/**
 * @file random service
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import base64url from "base64url";
import * as crypto from "crypto";
import * as moment from "moment";

export const random = {
  ordered(): string {
    return base64url.encode(ordered176());
  },
  unordered(): string {
    return base64url.encode(unordered128());
  }
};

export const randomService = random;

/**
 * Generates a url-safe, ordered, random string.
 * 48 bits for timestampBytes.
 * 128 bits for pseudorandom bits.
 */
function ordered176(): Buffer {
  const timestampBytes = Buffer.allocUnsafe(6);
  timestampBytes.writeUInt32BE(moment().unix(), 0);
  const randomBytes = crypto.randomBytes(16);
  return Buffer.concat([timestampBytes, randomBytes], 22);
}

/**
 * 128 pseudorandom bits.
 */
function unordered128(): Buffer {
  return crypto.randomBytes(16);
}
