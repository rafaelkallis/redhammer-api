/**
 * @file models index
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

export * from "./user";
export * from "./item";
import { itemAssociate } from "./item";
import { userAssociate } from "./user";

userAssociate();
itemAssociate();
