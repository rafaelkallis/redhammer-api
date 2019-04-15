/**
 * @file item route tests
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as request from "supertest";
import { server } from "../../";
import { Item, User } from "../models";
import * as services from "../services";

describe("items", () => {
  let user;
  // let accessToken;
  // let items;

  beforeEach(async () => {
    user = await User.create({
      id: services.random.id(),
      email: `${services.random.id()}@example.com`,
      name: "",
      address: ""
    });
  });

  describe("get items", () => {
    it("happy path", async () => {
      const response = await request(server).get("/v1/items");
      expect(response.status).toBe(200);
    });
  });
});
