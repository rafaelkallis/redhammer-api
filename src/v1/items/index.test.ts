/**
 * @file item route tests
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as request from "supertest";
import { app } from "../../app";
import * as constants from "../constants";
import { Item, User } from "../models";
import * as services from "../services";

describe("items", () => {
  let user;
  let accessToken;
  let items;

  beforeEach(async () => {
    user = await User.create({
      id: services.random.id(),
      email: `${services.random.id()}@example.com`,
      name: "",
      address: "",
      salt: "",
      hash: ""
    });
    const createAccessTokenResult = await services.token.createAccessToken(
      user.id
    );
    accessToken = createAccessTokenResult.accessToken;
    items = [
      await Item.create({
        id: services.random.id(),
        title: "Item1",
        tags: [],
        image: ""
      }),
      await Item.create({
        id: services.random.id(),
        title: "Item2",
        tags: [],
        image: ""
      }),
      await Item.create({
        id: services.random.id(),
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

  describe("get items", () => {
    it("happy path", async () => {
      const response = await request(app.callback())
        .get("/v1/items")
        .set(constants.ACCESS_TOKEN_HEADER, accessToken);
      expect(response.status).toBe(200);
      const itemJSONs = items.map(item => item.toJSON());
      for (const itemJSON of itemJSONs) {
        itemJSON.createdAt = itemJSON.createdAt.toJSON();
        itemJSON.updatedAt = itemJSON.updatedAt.toJSON();
      }
      expect(response.body).toEqual(itemJSONs);
    });
  });

  describe("add item", () => {
    it("happy path", async () => {
      const itemToAdd = {
        title: "Item4",
        tags: [],
        image: "http://example.com"
      };
      const response = await request(app.callback())
        .post("/v1/items")
        .set(constants.ACCESS_TOKEN_HEADER, accessToken)
        .send(itemToAdd);
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.id).toBeDefined();
      const item = await Item.findOne({ where: { id: response.body.id } });
      expect(item).not.toBeNull();
      const { id, ownerId, createdAt, updatedAt, ...addedItem } = item.toJSON();
      expect(addedItem).toEqual(itemToAdd);
      expect(ownerId).toBe(user.id);
    });
  });

  describe("patch item", () => {
    it("happy path", async () => {
      let [oldItem] = items;
      const response = await request(app.callback())
        .patch(`/v1/items/${oldItem.id}`)
        .set(constants.ACCESS_TOKEN_HEADER, accessToken)
        .send({ title: "new title" });
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      let newItem = await Item.findOne({ where: { id: oldItem.id } });
      newItem = newItem.toJSON();
      oldItem = oldItem.toJSON();
      delete newItem.updatedAt;
      delete oldItem.updatedAt;
      expect({ ...oldItem, title: "new title" }).toEqual(newItem);
    });
  });

  describe("delete item", () => {
    it("happy path", async () => {
      const [item] = items;
      const response = await request(app.callback())
        .delete(`/v1/items/${item.id}`)
        .set(constants.ACCESS_TOKEN_HEADER, accessToken);
      expect(response.status).toBe(200);
      expect(await Item.findOne({ where: { id: item.id } })).toBeNull();
    });
  });
});
