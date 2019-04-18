/**
 * @file item controller
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { Context } from "koa";
import { Item } from "../models";
import * as services from "../services";
import * as errors from "./errors";

export const itemController = {
  /**
   */
  async getItems({ request, response, state }: Context) {
    const items = await Item.findAll();
    response.status = 200;
    response.body = items.map(item => item.toJSON());
  },

  /**
   */
  async addItem({ request, response, state }: Context) {
    const item = Item.build(request.body);
    item.id = services.random.id();
    const decodedImageURI = services.dataURI.decode(request.body.image);
    if (!decodedImageURI) {
      throw errors.INVALID_IMAGE_ERROR();
    }
    const { mediaType, encoding, payload } = decodedImageURI;
    const key = services.random.id();
    item.image = await services.file.upload(key, payload, mediaType);
    await item.save();
    await item.setOwner(state.user);
    response.status = 200;
    response.body = item.toJSON();
  },

  /**
   */
  async patchItem({ request, response, params, state }: Context) {
    const item = await Item.findOne({
      where: { id: params.id }
    });
    if (!item) {
      throw errors.ITEM_NOT_FOUND_ERROR();
    }
    if (!(await state.user.hasItem(item))) {
      throw errors.USER_NOT_ITEM_OWNER_ERROR();
    }
    Object.assign(item, request.body);
    await item.save();
    response.status = 200;
    response.body = item.toJSON();
  },

  /**
   */
  async deleteItem({ request, response, params, state }: Context) {
    const item = await Item.findOne({
      where: {
        id: params.id
      }
    });
    if (!item) {
      throw errors.ITEM_NOT_FOUND_ERROR();
    }
    if (!(await state.user.hasItem(item))) {
      throw errors.USER_NOT_ITEM_OWNER_ERROR();
    }
    await item.destroy();
    response.status = 200;
  }
};
