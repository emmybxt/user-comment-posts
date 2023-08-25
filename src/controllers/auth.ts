import crypto from "crypto";
import { NextFunction, Response } from "express";

import { ResponseType } from "../helpers/users";
import * as userHelper from "../helpers/users";
import QueriesRepository from "../repository/queries";
import { ExpressRequest } from "../util/express";
import HandleResponse from "../util/response-handler";

export async function signUp(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  const { name, email, password } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await QueriesRepository.runQuery(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );

    if (existingUser.rowCount > 0) {
      return HandleResponse.sendErrorResponse({
        error: "Email already exists, try a different one",
        res,
      });
    }
    //hash password

    const hashedPassword = await crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const newUser = await QueriesRepository.runQuery(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword],
    );

    return HandleResponse.sendSuccessResponse({
      message: "User created successfully",
      data: newUser.rows[0],
      res,
    });
  } catch (error) {
    return next(error);
  }
}

export async function login(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  const { email, password } = req.body;

  try {
    const { rows } = await await QueriesRepository.runQuery(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );

    if (rows.length === 0) {
      return HandleResponse.sendErrorResponse({
        error: "User doesn't exist, please sign up",
        res,
      });
    }

    // Hash the entered password
    const enteredHashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    // Compare the hashes

    const userData = rows[0];

    if (enteredHashedPassword != userData.password) {
      return HandleResponse.sendErrorResponse({
        error: "Password is incorrect",
        res,
      });
    }

    delete userData.password;

    const token = await userHelper.generateUserBearerToken({
      userID: userData.id,
      userName: userData.name,
    });

    return HandleResponse.sendSuccessResponse({
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

export async function getAllUsers(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  try {
    const { rows } = await QueriesRepository.runQuery("SELECT * FROM users");

    if (rows.length === 0) {
      return HandleResponse.sendErrorResponse({
        error: "No users registered yet",
        res,
      });
    }

    return HandleResponse.sendSuccessResponse({
      message: "All users fetched successfully",
      data: rows,
      res,
    });
  } catch (error) {
    return next(error);
  }
}
