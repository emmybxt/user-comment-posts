import { createMock } from "@golevelup/ts-jest";
import { Response } from "express";
import { NextFunction } from "express";

import {
  createPosts,
  getTopUsersAndComment,
  getUserPosts,
} from "../controllers/posts";
import QueriesRepository from "../repository/queries";
import { ExpressRequest } from "../util/express";
import HandleResponse from "../util/response-handler";

jest.mock("../helpers/users");

describe("createPosts", () => {
  let req: ExpressRequest;
  let resMock: Response;
  let nextFn: NextFunction;
  let querySpy: jest.SpyInstance;
  let sendSuccessResponseMock: jest.SpyInstance;
  let sendErrorResponseMock: jest.SpyInstance;

  beforeEach(() => {
    req = createMock<ExpressRequest>({});
    req.params = { id: "1" };
    req.body = { title: "Test Post" };
    resMock = createMock<Response>();
    nextFn = jest.fn();
    querySpy = jest.spyOn(QueriesRepository, "runQuery");
    sendSuccessResponseMock = jest.spyOn(HandleResponse, "sendSuccessResponse");
    sendErrorResponseMock = jest.spyOn(HandleResponse, "sendErrorResponse");
  });

  afterEach(jest.resetAllMocks);

  it("should create a new post", async () => {
    const mockUser = { id: 1 };
    querySpy.mockResolvedValueOnce({ rows: [mockUser] });

    const mockPost = { title: "Test Post" };
    querySpy.mockResolvedValueOnce({ rows: [mockPost] });

    const mockSuccessResponse = {
      success: true,
      message: "Post created successfully",
      data: mockPost,
    };
    sendSuccessResponseMock.mockReturnValue(mockSuccessResponse);

    await createPosts(req, resMock, nextFn);

    expect(sendErrorResponseMock).not.toHaveBeenCalled();
    expect(nextFn).not.toHaveBeenCalled();
  });

  it("should fetch user posts successfully", async () => {
    const mockUser = { id: 1 };
    querySpy.mockResolvedValueOnce({ rows: [mockUser] });

    const mockUserPosts = [
      { id: 1, title: "Post 1", userId: 1 },
      { id: 2, title: "Post 2", userId: 1 },
    ];
    querySpy.mockResolvedValueOnce({ rows: mockUserPosts, rowCount: 2 });

    const mockSuccessResponse = {
      success: true,
      message: "User Posts Fetched successfully",
      data: mockUserPosts,
    };
    sendSuccessResponseMock.mockReturnValue(mockSuccessResponse);

    await getUserPosts(req, resMock, nextFn);

    expect(sendErrorResponseMock).not.toHaveBeenCalled();
    expect(nextFn).not.toHaveBeenCalled();
  });

  it("should send error response when user is not found", async () => {
    querySpy.mockResolvedValueOnce({ rows: [] });

    const mockErrorResponse = { success: false, error: "User not found" };
    sendErrorResponseMock.mockReturnValue(mockErrorResponse);

    await getUserPosts(req, resMock, nextFn);

    expect(querySpy).toHaveBeenCalledWith("SELECT * FROM users WHERE id = $1", [
      "1",
    ]);
    expect(querySpy).not.toHaveBeenCalledWith(
      "SELECT * FROM posts WHERE userid = $1",
      expect.any(Array),
    );
    expect(sendSuccessResponseMock).not.toHaveBeenCalled();
    expect(nextFn).not.toHaveBeenCalled();
  });

  it("should fetch top users and comments successfully", async () => {
    // Mock that the SELECT query returns user comments
    const mockUserComments = [
      { id: 1, userId: 1, content: "Comment 1" },
      { id: 2, userId: 2, content: "Comment 2" },
    ];
    querySpy.mockResolvedValueOnce({ rows: mockUserComments, rowCount: 2 });

    // Mock that the SELECT query returns user top posts and comments
    const mockTopPostsAndComments = [
      { id: 1, name: "User 1", title: "Post 1", content: "Comment 1" },
      { id: 2, name: "User 2", title: "Post 2", content: "Comment 2" },
    ];
    querySpy.mockResolvedValueOnce({ rows: mockTopPostsAndComments });

    const mockSuccessResponse = {
      success: true,
      message: "User top post & comments Fetched successfully",
      data: mockTopPostsAndComments,
    };
    sendSuccessResponseMock.mockReturnValue(mockSuccessResponse);

    await getTopUsersAndComment(req, resMock, nextFn);

    expect(querySpy).toHaveBeenCalledWith("SELECT * FROM comments");
    expect(sendErrorResponseMock).not.toHaveBeenCalled();
    expect(nextFn).not.toHaveBeenCalled();
  });

  it("should send success response when no comments exist", async () => {
    // Mock that the SELECT query returns no user comments
    querySpy.mockResolvedValueOnce({ rows: [], rowCount: 0 });

    const mockSuccessResponse = {
      success: true,
      message: "No comments made by any user yet",
    };
    sendSuccessResponseMock.mockReturnValue(mockSuccessResponse);

    await getTopUsersAndComment(req, resMock, nextFn);

    expect(querySpy).toHaveBeenCalledWith("SELECT * FROM comments");
    expect(sendErrorResponseMock).not.toHaveBeenCalled();
  });
});
