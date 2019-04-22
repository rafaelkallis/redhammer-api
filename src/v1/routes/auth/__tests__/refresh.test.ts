/**
 * @file refresh test
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { app } from "@app";
import { User } from "@v1/models";
import * as services from "@v1/services";
import * as request from "supertest";

describe("refresh", () => {
  let user: User;
  let verifySignatureSpy: jest.SpyInstance;
  let hasValidTimestampsSpy: jest.SpyInstance;
  let newAccessTokenSpy: jest.SpyInstance;
  let newRefreshTokenSpy: jest.SpyInstance;

  beforeEach(async () => {
    user = await User.create({
      id: services.random.ordered(),
      email: "user@example.com",
      name: "User",
      address: "Bahnhofstrasse 3, Zurich",
      salt: "password-salt",
      hash: "password-hash"
    });
    verifySignatureSpy = jest.spyOn(services.token, "verifySignature");
    hasValidTimestampsSpy = jest.spyOn(services.token, "hasValidTimestamps");
    newAccessTokenSpy = jest.spyOn(services.token, "newAccessToken");
    newRefreshTokenSpy = jest.spyOn(services.token, "newRefreshToken");
  });

  afterEach(async () => {
    verifySignatureSpy.mockRestore();
    hasValidTimestampsSpy.mockRestore();
    newAccessTokenSpy.mockRestore();
    newRefreshTokenSpy.mockRestore();
    await User.destroy({ where: {} });
  });

  test("happy path", async () => {
    verifySignatureSpy.mockReturnValue(
      Promise.resolve(services.token.newRefreshToken(user.id))
    );
    hasValidTimestampsSpy.mockReturnValue(true);
    const response = await request(app.callback())
      .post("/v1/auth/refresh")
      .send({ token: "refresh token" });
    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    expect(verifySignatureSpy).toHaveBeenCalledWith("refresh token");
    expect(newAccessTokenSpy).toHaveBeenCalledWith(user.id);
    expect(newRefreshTokenSpy).toHaveBeenCalledWith(user.id);
  });
});
