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
