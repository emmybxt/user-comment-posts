import { NextFunction, Response } from "express";
import Joi from "joi";

import { ResponseType } from "../helpers/users";
import { ExpressRequest } from "../util/express";
import HandleResponse from "../util/response-handler";

export async function validateCreateComment(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  const schema = Joi.object().keys({
    id: Joi.number().required(),
    content: Joi.string().required(),
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
