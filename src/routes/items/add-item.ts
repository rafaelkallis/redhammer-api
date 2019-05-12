/**
 * @file addItem controller
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as errors from "@errors";
import {
  authenticate,
  IAuthenticateContext,
  post,
  validate
} from "@middlewares";
import { Item } from "@models";
import * as services from "@services";
import Joi from "joi";
import { Context } from "koa";
import { IBodyContext } from "koa-bodyparser";

interface IAddItemBody {
  title: string;
  tags: string[];
  image: string;
}

interface IAddItemContext
  extends Context<IAuthenticateContext & IBodyContext<IAddItemBody>> {}

export const addItem = () =>
  post(
    "/",
    validate.body({
      title: Joi.string().required(),
      tags: Joi.array()
        .items(Joi.string())
        .required(),
      image: Joi.string().required()
    }),
    authenticate(),
    async (ctx: IAddItemContext) => {
      const decodedImageURI = services.dataURI.decode(ctx.request.body.image);
      if (!decodedImageURI) {
        throw new errors.InvalidImageError();
      }
      const { mediaType, payload } = decodedImageURI;
      const key = services.random.unordered();
      const image = await services.file.upload(key, payload, mediaType);
      const id = services.random.ordered();
      const { title, tags } = ctx.request.body;
      const item = await Item.create({
        id,
        ownerId: ctx.state.user.id,
        title,
        tags,
        image
      });
      ctx.response.status = 200;
      ctx.response.body = item;
    }
  );
