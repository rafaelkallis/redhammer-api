/**
 * @file signup test
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as moment from "moment";
import * as request from "supertest";
import { app } from "../../../../app";
import * as constants from "../../../constants";
import { User } from "../../../models";
import * as services from "../../../services";

describe("signup", () => {
  afterEach(async () => {
    await User.destroy({ where: {} });
  });

  it("happy path", async () => {
    const encryptSpy = jest
      .spyOn(services.token, "encrypt")
      .mockReturnValue(Promise.resolve("encrypted-token"));
    const sendVerifySignupSpy = jest
      .spyOn(services.email, "sendVerifySignup")
      .mockReturnValue(Promise.resolve());
    const email = `${services.random.id()}@example.com`;
    const newUser = {
      email,
      password: "pass",
      name: "name",
      address: "address"
    };
    const response = await request(app.callback())
      .post("/v1/auth/signup")
      .send(newUser);
    expect(response.status).toBe(200);
    expect(sendVerifySignupSpy).toHaveBeenCalledWith({
      to: email,
      token: "encrypted-token"
    });
    encryptSpy.mockRestore();
    sendVerifySignupSpy.mockRestore();
  });
});
