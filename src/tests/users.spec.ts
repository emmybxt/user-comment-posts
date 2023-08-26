import { createMock } from "@golevelup/ts-jest";
import crypto from "crypto";
import { Response } from "express";

import { IUser } from "../config/interfaces";
import { getAllUsers, login, signUp } from "../controllers/auth";
import * as userHelper from "../helpers/users";
import QueriesRepository from "../repository/queries";
import { ExpressRequest } from "../util/express";
import HandleResponse from "../util/response-handler";

jest.mock("../helpers/users");

describe("Request controller", () => {
  let req: ExpressRequest;

  const nextFn = jest.fn();
  let resMock: Response;
  let querySpy: jest.SpyInstance;
  let sendSuccessResponseMock: jest.SpyInstance;
  let sendErrorResponseMock: jest.SpyInstance;
  let createHashSpy: jest.SpyInstance;
  let generateUserBearerTokenSpy: jest.SpyInstance;

  let user: IUser;

  beforeEach(() => {
    req = createMock<ExpressRequest>({});

    querySpy = jest.spyOn(QueriesRepository, "runQuery");
    resMock = createMock<Response>();
    resMock.status = jest.fn().mockReturnValue(resMock);
    sendSuccessResponseMock = jest.spyOn(HandleResponse, "sendSuccessResponse");
    sendErrorResponseMock = jest.spyOn(HandleResponse, "sendErrorResponse");
    createHashSpy = jest.spyOn(crypto, "createHash");
    generateUserBearerTokenSpy = jest.spyOn(
      userHelper,
      "generateUserBearerToken",
    );

    user = createMock<IUser>({
      name: "John",
      password: "password",
    });

    querySpy.mockResolvedValue(user);
  });

  afterEach(jest.resetAllMocks);

  describe("Users controllers", () => {
    it("should create a new user", async () => {
      req.body = {
        name: "sukanmi",
        password: "see",
        email: "testemailssssss@test.com",
      };

      const hashedPassword = "hashedPassword";
      const newUser = {
        rows: [{ id: 1, name: "sukanmi", email: "testemailssssss@test.com" }],
      };

      querySpy.mockResolvedValue({ rowCount: 0 });
      createHashSpy.mockReturnValue({
        update: () => ({ digest: () => hashedPassword }),
      });
      querySpy.mockResolvedValue(newUser);

      const mockSuccessResponse = {
        success: true,
        message: "User created successfully",
        data: newUser.rows[0],
      };
      sendSuccessResponseMock.mockReturnValue(mockSuccessResponse);

      await signUp(req, resMock, nextFn);

      expect(querySpy).toHaveBeenCalledTimes(2);
      expect(createHashSpy).toHaveBeenCalledWith("sha256");
      expect(sendSuccessResponseMock).toHaveBeenCalledWith({
        message: "User created successfully",
        data: newUser.rows[0],
        res: resMock,
      });
      expect(sendErrorResponseMock).not.toHaveBeenCalled();
      expect(nextFn).not.toHaveBeenCalled();
    });

    it("should send error response when email already exists", async () => {
      req.body = {
        name: "sukanmi",
        password: "see",
        email: "testemailssssss@test.com",
      };

      querySpy.mockResolvedValue({ rowCount: 1 });

      const mockErrorResponse = {
        success: false,
        error: "Email already exists, try a different one",
      };
      sendErrorResponseMock.mockReturnValue(mockErrorResponse);

      await signUp(req, resMock, nextFn);

      expect(querySpy).toHaveBeenCalledTimes(1);
      expect(createHashSpy).not.toHaveBeenCalled();
      expect(sendSuccessResponseMock).not.toHaveBeenCalled();
      expect(sendErrorResponseMock).toHaveBeenCalledWith({
        error: "Email already exists, try a different one",
        res: resMock,
      });
      expect(nextFn).not.toHaveBeenCalled();
    });

    it("should call next with error when an error occurs", async () => {
      const mockError = new Error("Database error");
      querySpy.mockRejectedValue(mockError);

      await signUp(req, resMock, nextFn);

      expect(querySpy).toHaveBeenCalledTimes(1);
      expect(createHashSpy).not.toHaveBeenCalled();
      expect(sendSuccessResponseMock).not.toHaveBeenCalled();
      expect(sendErrorResponseMock).not.toHaveBeenCalled();
      expect(nextFn).toHaveBeenCalledWith(mockError);
    });

    it("should send success response with user data when users are fetched", async () => {
      const mockRows = [
        { id: 1, name: "User1" },
        { id: 2, name: "User2" },
      ];
      querySpy.mockResolvedValue({ rows: mockRows });

      const mockSuccessResponse = {
        success: true,
        message: "All users fetched successfully",
        data: mockRows,
      };
      sendSuccessResponseMock.mockReturnValue(mockSuccessResponse);

      await getAllUsers(req, resMock, nextFn);

      expect(querySpy).toHaveBeenCalledWith("SELECT * FROM users");
      expect(sendSuccessResponseMock).toHaveBeenCalledWith({
        message: "All users fetched successfully",
        data: mockRows,
        res: resMock,
      });
      expect(sendErrorResponseMock).not.toHaveBeenCalled();
      expect(nextFn).not.toHaveBeenCalled();
    });

    it("should send error response when no users are fetched", async () => {
      querySpy.mockResolvedValue({ rows: [] });

      const mockErrorResponse = {
        success: false,
        error: "No users registered yet",
      };
      sendErrorResponseMock.mockReturnValue(mockErrorResponse);

      await getAllUsers(req, resMock, nextFn);

      expect(querySpy).toHaveBeenCalledWith("SELECT * FROM users");
      expect(sendErrorResponseMock).toHaveBeenCalledWith({
        error: "No users registered yet",
        res: resMock,
      });
      expect(nextFn).not.toHaveBeenCalled();
    });

    it("should log in a user successfully", async () => {
      req.body = {
        email: "testemailssssss@test.com",
        password: "see",
      };

      const hashedPassword = "hashedPassword";
      const mockUser = {
        id: 1,
        name: "sukanmi",
        password: hashedPassword,
      };

      querySpy.mockResolvedValue({ rows: [mockUser] });
      createHashSpy.mockReturnValue({
        update: () => ({ digest: () => hashedPassword }),
      });
      generateUserBearerTokenSpy.mockResolvedValue("mockToken");

      const mockSuccessResponse = {
        success: true,
        message: "Login successful",
        data: {
          token: "mockToken",
          userData: { id: 1, name: "sukanmi" },
        },
      };
      sendSuccessResponseMock.mockReturnValue(mockSuccessResponse);

      await login(req, resMock, nextFn);

      expect(querySpy).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE email = $1",
        ["testemailssssss@test.com"],
      );
      expect(createHashSpy).toHaveBeenCalledWith("sha256");
      expect(generateUserBearerTokenSpy).toHaveBeenCalledWith({
        userID: mockUser.id,
        userName: mockUser.name,
      });
      expect(sendSuccessResponseMock).toHaveBeenCalledWith({
        message: "Login successful",
        data: {
          token: "mockToken",
          userData: { id: 1, name: "sukanmi" },
        },
        res: resMock,
      });
      expect(sendErrorResponseMock).not.toHaveBeenCalled();
      expect(nextFn).not.toHaveBeenCalled();
    });

    it("should send error response when user doesn't exist", async () => {
      req.body = {
        email: "nonexistent@test.com",
        password: "see",
      };

      querySpy.mockResolvedValue({ rows: [] });

      const mockErrorResponse = {
        success: false,
        error: "User doesn't exist, please sign up",
      };
      sendErrorResponseMock.mockReturnValue(mockErrorResponse);

      await login(req, resMock, nextFn);

      expect(querySpy).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE email = $1",
        ["nonexistent@test.com"],
      );
      expect(createHashSpy).not.toHaveBeenCalled();
      expect(generateUserBearerTokenSpy).not.toHaveBeenCalled();
      expect(sendSuccessResponseMock).not.toHaveBeenCalled();
      expect(sendErrorResponseMock).toHaveBeenCalledWith({
        error: "User doesn't exist, please sign up",
        res: resMock,
      });
      expect(nextFn).not.toHaveBeenCalled();
    });
  });
});
