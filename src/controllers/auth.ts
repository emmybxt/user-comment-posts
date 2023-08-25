import { NextFunction, Response } from "express";
import crypto from "crypto";
import { ResponseType } from "../helpers/users";
import * as userHelper from "../helpers/users";
import { ExpressRequest } from "../util/express";
import HandleResponse from "../util/response-handler";
import { DBclient } from "../util/sequelize";

export async function signUp(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  const { name, email, password } = req.body;

  try {
    // Check if the username already exists
    const checkUserQuery = "SELECT * FROM users WHERE email = $1";
    const existingUser = await DBclient.query(checkUserQuery, [email]);

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

    // Insert the new user
    const insertUserQuery =
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *";
    const newUser = await DBclient.query(insertUserQuery, [
      name,
      email,
      hashedPassword,
    ]);

    return HandleResponse.sendSuccessResponse({
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
  const { email, password } = req.body;

  try {
    const query = "SELECT * FROM users WHERE email = $1";
    const { rows } = await DBclient.query(query, [email]);

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

    console.log(userData.password);

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
    const query = "SELECT * FROM users";
    const { rows } = await DBclient.query(query);

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
