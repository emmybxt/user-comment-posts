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

    const query = `SELECT users.id, users.name, p.title, c.content
    FROM users
    LEFT JOIN (
        SELECT userId, MAX(createdAt) AS max_createdAt
        FROM posts
        GROUP BY userId
    ) recent_posts ON users.id = recent_posts.userId
    LEFT JOIN posts p ON recent_posts.userId = p.userId AND recent_posts.max_createdAt = p.createdAt
    LEFT JOIN (
        SELECT postId, MAX(createdAt) AS max_comment_createdAt
        FROM comments
        GROUP BY postId
    ) recent_comments ON p.id = recent_comments.postId
    LEFT JOIN comments c ON recent_comments.postId = c.postId AND recent_comments.max_comment_createdAt = c.createdAt
    ORDER BY (
        SELECT COUNT(id)
        FROM posts
        WHERE userId = users.id
    ) DESC
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
