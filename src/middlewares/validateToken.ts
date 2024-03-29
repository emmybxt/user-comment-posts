import { NextFunction, Response } from "express";
import Joi from "joi";
import jwt from "jsonwebtoken";

import { TOKEN_SECRET } from "../config/env";
import * as userHelper from "../helpers/users";
import { ExpressRequest } from "../util/express";
import HandleResponse from "../util/response-handler";
import { DBclient } from "../util/sequelize";

export function throwIfUndefined<T>(x: T | undefined, name?: string): T {
  if (x === undefined) {
    throw new Error(`${name} must not be undefined`);
  }
  return x;
}

export async function validateToken(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> {
  let { authorization } = req.headers;

  const schema = Joi.object()
    .keys({
      authorization: Joi.string()
        .regex(/^Bearer [A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
        .required()
        .label("authorization [header]"),
    })
    .unknown(true);

  const validation = schema.validate(req.headers);

  if (validation.error) {
    return HandleResponse.sendErrorResponse({
      error: validation.error.details[0].message,
      res,
    });
  }

  try {
    authorization = throwIfUndefined(authorization, "authorization");

    const [, token] = authorization.split("Bearer ");
    let decoded: { id: string };

    try {
      decoded = jwt.verify(token, `${TOKEN_SECRET}`) as {
        id: string;
      };
    } catch {
      return HandleResponse.sendErrorResponse({
        error: `You're not authorized to carry out this operation. Kindly log out and login with authorized credentials`,
        res,
        status: 401,
      });
    }
    //check redis for active session

    const tokenStatus = await userHelper.isTokenValid(token);
    if (!tokenStatus) {
      return HandleResponse.sendErrorResponse({
        error: `You're not authorized to carry out this operation. Kindly log out and login with authorized credentials`,
        res,
        status: 401,
      });
    }

    const checkUserQuery = "SELECT * FROM users WHERE id = $1";
    const user = await DBclient.query(checkUserQuery, [decoded.id]);

    if (!user) {
      return HandleResponse.sendErrorResponse({
        error: `You're not authorized to carry out this operation. Kindly log out and login with authorized credentials`,
        res,
        status: 401,
      });
    }

    req.user = user.rows[0];
    return next();
  } catch (error) {
    return next(error);
  }
}
