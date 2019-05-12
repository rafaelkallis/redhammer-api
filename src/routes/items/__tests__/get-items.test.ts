/**
 * @file getItems test
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { server } from "@app";
import { ACCESS_TOKEN_HEADER } from "@constants";
import { Item, User } from "@models";
import * as services from "@services";
import request from "supertest";

describe("get items", () => {
  let user: User;
  let accessToken: string;
  let items: Item[];

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
    items = [
      await Item.create({
        id: services.random.ordered(),
        title: "Item1",
        tags: [],
        image: ""
      }),
      await Item.create({
        id: services.random.ordered(),
        title: "Item2",
        tags: [],
        image: ""
      }),
      await Item.create({
        id: services.random.ordered(),
        title: "Item3",
        tags: [],
        image: ""
      })
    ];
    for (const item of items) {
      await item.setOwner(user);
    }
  });

  afterEach(async () => {
    await Item.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  test("happy path", async () => {
    const response = await request(server)
      .get("/v1/items")
      .set(ACCESS_TOKEN_HEADER, accessToken);
    expect(response.status).toBe(200);
    const itemJSONs: any = items.map(item => item.toJSON());
    for (const itemJSON of itemJSONs) {
      itemJSON.createdAt = itemJSON.createdAt.toJSON();
      itemJSON.updatedAt = itemJSON.updatedAt.toJSON();
    }
    expect(response.body).toEqual(itemJSONs);
  });
});
