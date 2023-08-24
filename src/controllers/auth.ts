import { NextFunction, Response } from "express";
import { ExpressRequest } from "../util/express";
import { User } from "../models/users";
import ResponseHandler from "../util/response-handler";
import { ResponseType } from "../helpers/users";

export async function signUp(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  const { username, password, email } = req.body;

  try {
    const user = await User.findOne({ where: { username: username } });

    console.log(user);

    if (user) {
      return ResponseHandler.sendErrorResponse({
        error: "Username already exists, try a different one",
        res,
      });
    }

    const newUser = await User.create({
      username,
      email,
      password,
    });

    return ResponseHandler.sendSuccessResponse({
      message: "User created successfully",
      data: newUser,
      res,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
}
