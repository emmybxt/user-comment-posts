import { NextFunction, Response } from "express";
import Joi from "joi";

import { ExpressRequest } from "../util/express";
import { ResponseType } from "../helpers/users";

import HandleResponse from "../util/response-handler";

export async function validateCreatePost(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  const schema = Joi.object().keys({
    id: Joi.number().required(),
    title: Joi.string().required(),
  });

  const validation = schema.validate({ ...req.body, ...req.params });

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

export async function validateGetUserPost(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  const schema = Joi.object().keys({
    id: Joi.number().required(),
  });

  const validation = schema.validate(req.params);

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
