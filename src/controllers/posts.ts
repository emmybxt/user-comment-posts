import { NextFunction, Response } from "express";

import { ResponseType } from "../helpers/users";
import { ExpressRequest } from "../util/express";
import HandleResponse from "../util/response-handler";
import { DBclient } from "../util/sequelize";

export async function createPosts(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  const { id, title }: { id: number; title: string } = {
    ...req.body,
    ...req.params,
  };

  try {
    const query = "SELECT * FROM users WHERE id = $1";
    const { rows } = await DBclient.query(query, [id]);

    if (rows.length === 0) {
      return HandleResponse.sendErrorResponse({
        error: "User not found",
        res,
      });
    }

    const insertPostQuery =
      "INSERT INTO posts (title, userId) VALUES ($1, $2) RETURNING *";
    const newUser = await DBclient.query(insertPostQuery, [title, id]);

    return HandleResponse.sendSuccessResponse({
      message: "Post created successfully",
      data: newUser.rows[0],
      res,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
}
export async function getUserPosts(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  const { id } = req.params;

  try {
    const query = "SELECT * FROM users WHERE id = $1";
    const { rows } = await DBclient.query(query, [id]);

    if (rows.length === 0) {
      return HandleResponse.sendErrorResponse({
        error: "User not found",
        res,
      });
    }

    const userPostsQuery = "SELECT * FROM posts WHERE userid = $1";
    const userPosts = await DBclient.query(userPostsQuery, [id]);

    if (userPosts.rowCount === 0) {
      return HandleResponse.sendSuccessResponse({
        message: "No posts by user yet",
        res,
      });
    }

    return HandleResponse.sendSuccessResponse({
      message: "User Posts Fetched succesfully",
      data: userPosts.rows,
      res,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getTopUsersAndComment(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  try {
    const usersCommentQuery = "SELECT * FROM comments";
    const usersComment = await DBclient.query(usersCommentQuery);

    if (usersComment.rowCount === 0) {
      return HandleResponse.sendSuccessResponse({
        message: "No comments made by any user yet",
        res,
      });
    }

    const query = `SELECT
  u.id,
  u.name,
  p.title,
  c.content
FROM
  users u
LEFT JOIN (
  SELECT
      p1.userId,
      p1.id AS postId,
      p1.title
  FROM
      posts p1
  WHERE
      p1.createdAt = (SELECT MAX(p2.createdAt) FROM posts p2 WHERE p2.userId = p1.userId)
) p ON u.id = p.userId
LEFT JOIN (
  SELECT
      c1.postId,
      c1.content
  FROM
      comments c1
  WHERE
      c1.createdAt = (SELECT MAX(c2.createdAt) FROM comments c2 WHERE c2.postId = c1.postId)
) c ON p.postId = c.postId
ORDER BY
  (SELECT COUNT(p3.id) FROM posts p3 WHERE p3.userId = u.id) DESC
LIMIT 3`;

    const usersTopPostsAndComments = await DBclient.query(query);

    return HandleResponse.sendSuccessResponse({
      message: "User Posts Fetched succesfully",
      data: usersTopPostsAndComments.rows,
      res,
    });
  } catch (error) {
    return next(error);
  }
}
