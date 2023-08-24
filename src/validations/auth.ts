import { NextFunction, Response } from "express";
import Joi from "joi";

import { ExpressRequest } from "../util/express";
import { ResponseType } from "../helpers/users";

import HandleResponse from "../util/response-handler";

export async function validateSignUp(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  const schema = Joi.object().keys({
    name: Joi.string().min(2).required(),
    email: Joi.string().required(),
    password: Joi.string().min(4).max(8).required(),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    return HandleResponse.sendErrorResponse({
      error: validation.error.message
        ? validation.error.message
        : validation.error.details[0].message,

      res,
    });
  }

  return next();
}

export async function validateLogin(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  const schema = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().min(4).max(8).required(),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    return HandleResponse.sendErrorResponse({
      error: validation.error.message
        ? validation.error.message
        : validation.error.details[0].message,

      res,
    });
  }

  return next();
}
