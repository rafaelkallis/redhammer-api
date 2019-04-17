/**
 * @file auth route tests
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as moment from "moment";
import * as request from "supertest";
import { app } from "../../app";
import * as constants from "../constants";
import { User } from "../models";
import * as services from "../services";

describe("auth", () => {
  afterEach(async () => {
    await User.destroy({ where: {} });
  });

  describe("signup", () => {
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

  describe("verify", () => {
    it("happy path", async () => {
      const genSaltSpy = jest
        .spyOn(services.password, "genSalt")
        .mockReturnValue("password-salt");
      const hashSpy = jest
        .spyOn(services.password, "hash")
        .mockReturnValue(Promise.resolve("password-hash"));
      const id = services.random.id();
      const userId = "123";
      const payload = {
        jti: id,
        sub: userId,
        aud: constants.SIGNUP_TOKEN,
        iat: moment().unix(),
        exp: moment()
          .add(constants.SIGNUP_TOKEN_LIFETIME_MIN, "minutes")
          .unix(),
        email: "user@example.com",
        password: "password",
        name: "User",
        address: "Bahnhofstrasse 3, Zurich"
      };
      const token = await services.token.encrypt(payload);
      const response = await request(app.callback())
        .post("/v1/auth/verify")
        .query({ token });
      expect(response.status).toBe(200);
      expect(hashSpy).toHaveBeenCalledWith("password", "password-salt");
      const addedUser = await User.findOne({ where: { id: userId } });
      expect(addedUser).not.toBeNull();
      expect(addedUser.hash).toBe("password-hash");
      genSaltSpy.mockRestore();
      hashSpy.mockRestore();
    });
  });

  describe("login", () => {
    it("happy path", async () => {
      await User.create({
        id: "123",
        email: "user@example.com",
        name: "User",
        address: "Bahnhofstrasse 3, Zurich",
        salt: "password-salt",
        hash: "password-hash"
      });
      const verifySpy = jest
        .spyOn(services.password, "verify")
        .mockReturnValue(Promise.resolve(true));
      const createAccessTokenSpy = jest
        .spyOn(services.token, "createAccessToken")
        .mockReturnValue(
          Promise.resolve({
            accessToken: "access token",
            accessTokenPayload: {
              jti: "1",
              aud: constants.ACCESS_TOKEN,
              sub: "123",
              exp: 1,
              iat: 1
            }
          })
        );
      const createRefreshTokenSpy = jest
        .spyOn(services.token, "createRefreshToken")
        .mockReturnValue(
          Promise.resolve({
            refreshToken: "refresh token",
            refreshTokenPayload: {
              jti: "1",
              aud: constants.REFRESH_TOKEN,
              sub: "123",
              exp: 1,
              iat: 1
            }
          })
        );
      const response = await request(app.callback())
        .post("/v1/auth/login")
        .send({
          email: "user@example.com",
          password: "password"
        });
      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
      expect(verifySpy).toHaveBeenCalledWith(
        "password",
        "password-salt",
        "password-hash"
      );
      expect(createAccessTokenSpy).toHaveBeenCalledWith("123");
      expect(createRefreshTokenSpy).toHaveBeenCalledWith("123");
      verifySpy.mockRestore();
      createAccessTokenSpy.mockRestore();
      createRefreshTokenSpy.mockRestore();
    });
  });

  describe("refresh", () => {
    fit("happy path", async () => {
      await User.create({
        id: "123",
        email: "user@example.com",
        name: "User",
        address: "Bahnhofstrasse 3, Zurich",
        salt: "password-salt",
        hash: "password-hash"
      });
      const verifySignatureSpy = jest
        .spyOn(services.token, "verifySignature")
        .mockReturnValue(
          Promise.resolve({
            jti: "1",
            aud: constants.REFRESH_TOKEN,
            sub: "123",
            exp: 1,
            iat: 1
          })
        );
      const hasValidTimestampsSpy = jest
        .spyOn(services.token, "hasValidTimestamps")
        .mockReturnValue(true);
      const createAccessTokenSpy = jest
        .spyOn(services.token, "createAccessToken")
        .mockReturnValue(
          Promise.resolve({
            accessToken: "access token",
            accessTokenPayload: {
              jti: "1",
              aud: constants.ACCESS_TOKEN,
              sub: "123",
              exp: 1,
              iat: 1
            }
          })
        );
      const createRefreshTokenSpy = jest
        .spyOn(services.token, "createRefreshToken")
        .mockReturnValue(
          Promise.resolve({
            refreshToken: "refresh token",
            refreshTokenPayload: {
              jti: "1",
              aud: constants.REFRESH_TOKEN,
              sub: "123",
              exp: 1,
              iat: 1
            }
          })
        );
      const response = await request(app.callback())
        .post("/v1/auth/refresh")
        .send({ token: "refresh token" });
      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
      expect(verifySignatureSpy).toHaveBeenCalledWith("refresh token");
      expect(createAccessTokenSpy).toHaveBeenCalledWith("123");
      expect(createRefreshTokenSpy).toHaveBeenCalledWith("123");
      verifySignatureSpy.mockRestore();
      hasValidTimestampsSpy.mockRestore();
      createAccessTokenSpy.mockRestore();
      createRefreshTokenSpy.mockRestore();
    });
  });
});
