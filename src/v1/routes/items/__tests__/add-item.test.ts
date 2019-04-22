/**
 * @file addItem test
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { app } from "@app";
import { ACCESS_TOKEN_HEADER } from "@v1/constants";
import { Item, User } from "@v1/models";
import * as services from "@v1/services";
import * as _ from "lodash";
import * as request from "supertest";

describe("add item", () => {
  let uploadSpy: jest.SpyInstance;
  let user: User;
  let accessToken: string;

  beforeEach(async () => {
    uploadSpy = jest.spyOn(services.file, "upload");
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
  });

  afterEach(async () => {
    await Item.destroy({ where: {} });
    await User.destroy({ where: {} });
    uploadSpy.mockRestore();
  });

  test("happy path", async () => {
    uploadSpy.mockReturnValue(Promise.resolve("http://example.com"));
    const itemToAdd = {
      title: "Item4",
      tags: [],
      image:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
    };
    const response = await request(app.callback())
      .post("/v1/items")
      .set(ACCESS_TOKEN_HEADER, accessToken)
      .send(itemToAdd);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.id).toBeDefined();
    const item = await Item.findOne({ where: { id: response.body.id } });
    expect(item).not.toBeNull();
    const props = ["title", "tags", "image"];
    expect(_.pick(item, props)).toEqual({
      ..._.pick(itemToAdd, props),
      image: "http://example.com"
    });
    expect((item as Item).ownerId).toBe(user.id);
  });
});
