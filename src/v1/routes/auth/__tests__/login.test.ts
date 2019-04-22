/**
 * @file login test
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { app } from "@app";
import { User } from "@v1/models";
import * as services from "@v1/services";
import * as request from "supertest";

describe("login", () => {
  let verifySpy: jest.SpyInstance;
  let newAccessTokenSpy: jest.SpyInstance;
  let newRefreshTokenSpy: jest.SpyInstance;
  let user: User;

  beforeEach(async () => {
    verifySpy = jest.spyOn(services.password, "verify");
    newAccessTokenSpy = jest.spyOn(services.token, "newAccessToken");
    newRefreshTokenSpy = jest.spyOn(services.token, "newRefreshToken");
    user = await User.create({
      id: services.random.ordered(),
      email: "user@example.com",
      name: "User",
      address: "Bahnhofstrasse 3, Zurich",
      salt: "password-salt",
      hash: "password-hash"
    });
  });

  afterEach(async () => {
    await User.destroy({ where: {} });
    verifySpy.mockRestore();
    newAccessTokenSpy.mockRestore();
    newRefreshTokenSpy.mockRestore();
  });

  test("happy path", async () => {
    verifySpy.mockReturnValue(Promise.resolve(true));
    const response = await request(app.callback())
      .post("/v1/auth/login")
      .send({
        email: "user@example.com",
        password: "password"
      });
    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.accessToken.data).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    expect(response.body.refreshToken.data).toBeDefined();
    expect(verifySpy).toHaveBeenCalledWith("password", user.salt, user.hash);
    expect(newAccessTokenSpy).toHaveBeenCalledWith(user.id);
    expect(newRefreshTokenSpy).toHaveBeenCalledWith(user.id);
  });
});
