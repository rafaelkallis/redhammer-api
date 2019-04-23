/**
 * @file deleteItem test
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { server } from "@app";
import { ACCESS_TOKEN_HEADER } from "@v1/constants";
import { Item, User } from "@v1/models";
import * as services from "@v1/services";
import _ from "lodash";
import request from "supertest";

describe("delete item", () => {
  let user: User;
  let accessToken: string;
  let existingItem: Item;

  beforeEach(async () => {
    user = await User.create({
      id: services.random.ordered(),
      email: "user@example.com",
      name: "",
      address: "",
      salt: "",
      hash: ""
    });
    const accessTokenPayload = services.token.newAccessToken(user.id);
    accessToken = await services.token.sign(accessTokenPayload);
    existingItem = await Item.create({
      id: services.random.ordered(),
      title: "Item1",
      tags: [],
      image: ""
    });
    await existingItem.setOwner(user);
  });

  afterEach(async () => {
    await Item.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  test("happy path", async () => {
    const response = await request(server)
      .delete(`/v1/items/${existingItem.id}`)
      .set(ACCESS_TOKEN_HEADER, accessToken);
    expect(response.status).toBe(200);
    expect(await Item.findOne({ where: { id: existingItem.id } })).toBeNull();
  });
});
