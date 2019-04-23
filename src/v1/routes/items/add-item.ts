/**
 * @file addItem controller
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as errors from "@v1/errors";
import { validate } from "@v1/middlewares";
import { Item } from "@v1/models";
import * as services from "@v1/services";
import Joi from "joi";
import compose from "koa-compose";
import { RouterContext } from "koa-router";

export const addItem = () =>
  compose([
    validate.body({
      title: Joi.string().required(),
      tags: Joi.array()
        .items(Joi.string())
        .required(),
      image: Joi.string().required()
    }),
    async ({ request, response, state }: RouterContext) => {
      const item = Item.build(request.body);
      item.id = services.random.ordered();
      const decodedImageURI = services.dataURI.decode(request.body.image);
      if (!decodedImageURI) {
        throw errors.INVALID_IMAGE_ERROR();
      }
      const { mediaType, payload } = decodedImageURI;
      const key = services.random.unordered();
      item.image = await services.file.upload(key, payload, mediaType);
      await item.save();
      await item.setOwner(state.user);
      response.status = 200;
      response.body = item.toJSON();
    }
  ]);
