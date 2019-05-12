/**
 * @file verify test
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { server } from "@app";
import { User } from "@models";
import * as services from "@services";
import request from "supertest";

describe("verify", () => {
  let genSaltSpy: jest.SpyInstance;
  let hashSpy: jest.SpyInstance;

  beforeEach(async () => {
    genSaltSpy = jest.spyOn(services.password, "genSalt");
    hashSpy = jest.spyOn(services.password, "hash");
  });

  afterEach(async () => {
    genSaltSpy.mockRestore();
    hashSpy.mockRestore();
    await User.destroy({ where: {} });
  });

  test("happy path", async () => {
    genSaltSpy.mockReturnValue("password-salt");
    hashSpy.mockReturnValue(Promise.resolve("password-hash"));
    const userId = services.random.ordered();
    const payload = services.token.newSignupToken({
      sub: userId,
      email: "user@example.com",
      password: "password",
      name: "User",
      address: "Bahnhofstrasse 3, Zurich"
    });
    const token = await services.token.encrypt(payload);
    const response = await request(server)
      .post("/v1/auth/verify")
      .query({ token });
    expect(response.status).toBe(200);
    expect(hashSpy).toHaveBeenCalledWith("password", "password-salt");
    const addedUser = await User.findOne({ where: { id: userId } });
    expect(addedUser).not.toBeNull();
    expect((addedUser as User).hash).toBe("password-hash");
  });
});
