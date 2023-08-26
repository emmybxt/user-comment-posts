import { createMock } from "@golevelup/ts-jest";
import { NextFunction, Response } from "express";
import QueriesRepository from "../repository/queries";
import * as userHelper from "../helpers/users";

import { createComment } from "../controllers/comment";
import { IUser } from "../config/interfaces";
import { ExpressRequest } from "../util/express";
import HandleResponse from "../util/response-handler";

jest.mock("../helpers/users");

let user;

describe("createComment", () => {
  let req: ExpressRequest;
  let resMock: Response;
  let nextFn: NextFunction;
  let querySpy: jest.SpyInstance;
  let sendSuccessResponseMock: jest.SpyInstance;
  let sendErrorResponseMock: jest.SpyInstance;
  let throwIfUndefinedSpy: jest.SpyInstance;

  beforeEach(() => {
    user = createMock<IUser>({
      name: "iphone",
      password: "145556",
    });
    req = createMock<ExpressRequest>({});
    req.params = { id: "postId" };
    req.body = { content: "test content" };
    req.user = user;
    resMock = createMock<Response>();
    nextFn = jest.fn();
    querySpy = jest.spyOn(QueriesRepository, "runQuery");
    sendSuccessResponseMock = jest.spyOn(HandleResponse, "sendSuccessResponse");
    sendErrorResponseMock = jest.spyOn(HandleResponse, "sendErrorResponse");

    querySpy.mockResolvedValue(user);
  });

  afterEach(jest.resetAllMocks);

  it("should send error response when post ID is not valid", async () => {
    // Mock that the SELECT query returns no rows (post not found)
    querySpy.mockResolvedValueOnce({ rows: [] });

    const mockErrorResponse = { success: false, error: "Post not found" };
    sendErrorResponseMock.mockReturnValue(mockErrorResponse);

    await createComment(req, resMock, nextFn);

    // expect(throwIfUndefinedSpy).toHaveBeenCalledWith(req.user, 'req.user');

    expect(sendSuccessResponseMock).not.toHaveBeenCalled();
    expect(sendErrorResponseMock).toHaveBeenCalledWith({
      error: "Post not found",
      res: resMock,
    });
    expect(nextFn).not.toHaveBeenCalled();
  });
});
