import { NextFunction, Response } from "express";
import { ExpressRequest } from "../util/express";
import ResponseHandler from "../util/response-handler";
import { ResponseType } from "../helpers/users";
import * as userHelper from "../helpers/users";
import { DBclient } from "../util/sequelize";

export async function signUp(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  const { name } = req.body;

  try {
    // Check if the username already exists
    const checkUserQuery = "SELECT * FROM users WHERE name = $1";
    const existingUser = await DBclient.query(checkUserQuery, [name]);

    if (existingUser.rowCount > 0) {
      return ResponseHandler.sendErrorResponse({
        error: "Username already exists, try a different one",
        res,
      });
    }

    // Insert the new user
    const insertUserQuery = "INSERT INTO users (name) VALUES ($1) RETURNING *";
    const newUser = await DBclient.query(insertUserQuery, [name]);

    return ResponseHandler.sendSuccessResponse({
      message: "User created successfully",
      data: newUser.rows[0],
      res,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
}

export async function login(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  const { name } = req.body;

  try {
    const query = "SELECT * FROM users WHERE name = $1";
    const { rows } = await DBclient.query(query, [name]);

    if (rows.length === 0) {
      return ResponseHandler.sendErrorResponse({
        error: "User doesn't exist, please sign up",
        res,
      });
    }

    const userData = rows[0];

    const token = await userHelper.generateUserBearerToken({
      userID: userData.id,
      userName: userData.name,
    });

    return ResponseHandler.sendSuccessResponse({
      message: "Login successful",
      data: {
        token,
        userData,
      },
      res,
    });
  } catch (error) {
    return next(error);
  }
}

export async function createPosts(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  const { id, title }: { id: number; title: string; content: string } = {
    ...req.body,
    ...req.params,
  };

  try {
    const query = "SELECT * FROM users WHERE id = $1";
    const { rows } = await DBclient.query(query, [id]);

    if (rows.length === 0) {
      return ResponseHandler.sendErrorResponse({
        error: "User not found",
        res,
      });
    }

    const insertPostQuery =
      "INSERT INTO posts (title, userId) VALUES ($1, $2) RETURNING *";
    const newUser = await DBclient.query(insertPostQuery, [title, id]);

    return ResponseHandler.sendSuccessResponse({
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
      return ResponseHandler.sendErrorResponse({
        error: "User not found",
        res,
      });
    }

    const userPostsQuery = "SELECT * FROM posts WHERE userid = $1";
    const userPosts = await DBclient.query(userPostsQuery, [id]);

    return ResponseHandler.sendSuccessResponse({
      message: "User Posts Fetched succesfully",
      data: userPosts.rows,
      res,
    });
  } catch (error) {
    return next(error);
  }
}
