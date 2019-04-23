/**
 * @file signup test
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { server } from "@app";
import { User } from "@v1/models";
import * as services from "@v1/services";
import request from "supertest";

describe("signup", () => {
  let encryptSpy: jest.SpyInstance;
  let sendVerifySignupSpy: jest.SpyInstance;

  beforeEach(async () => {
    encryptSpy = jest.spyOn(services.token, "encrypt");
    sendVerifySignupSpy = jest.spyOn(services.email, "sendVerifySignup");
  });

  afterEach(async () => {
    await User.destroy({ where: {} });
    encryptSpy.mockRestore();
    sendVerifySignupSpy.mockRestore();
  });

  test("happy path", async () => {
    encryptSpy.mockReturnValue(Promise.resolve("encrypted-token"));
    sendVerifySignupSpy.mockReturnValue(Promise.resolve());
    const newUser = {
      email: "user@example.com",
      password: "pass",
      name: "name",
      address: "address"
    };
    const response = await request(server)
      .post("/v1/auth/signup")
      .send(newUser);
    expect(response.status).toBe(200);
    expect(sendVerifySignupSpy).toHaveBeenCalledWith({
      to: newUser.email,
      token: "encrypted-token"
    });
  });
});
