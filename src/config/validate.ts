import Joi, { ObjectSchema } from "joi";

import { logger } from "../util/logger";

export const SCHEMA = {
  OPTIONAL_EMAIL: Joi.string().email().allow("").optional(),
  OPTIONAL_HOST_NAME: Joi.string().hostname().allow("").optional(),
  OPTIONAL_IP_STRING: Joi.string().ip().allow("").optional(),
  OPTIONAL_NUMBER: Joi.number().allow("").optional(),
  OPTIONAL_NUMERIC_SWITCH: Joi.number().integer().min(0).max(1).optional(),
  OPTIONAL_STRING: Joi.string().allow("").optional(),
  OPTIONAL_URI_STRING: Joi.string().uri().allow("").optional(),
  REQUIRED_BOOLEAN: Joi.boolean().required(),
  REQUIRED_EMAIL: Joi.string().email().required(),
  REQUIRED_HOST_NAME: Joi.string().hostname().required(),
  REQUIRED_IP_STRING: Joi.string().ip().required(),
  REQUIRED_NUMBER: Joi.number().required(),
  REQUIRED_NUMERIC_SWITCH: Joi.number().integer().min(0).max(1).required(),
  REQUIRED_STRING_ALLOW_EMPTY: Joi.string().allow("").required(),
  REQUIRED_STRING: Joi.string().required(),
  REQUIRED_URI_STRING: Joi.string().uri().required(),
};

const schema = Joi.object({
  NODE_ENV: SCHEMA.REQUIRED_STRING_ALLOW_EMPTY,
  PORT: SCHEMA.REQUIRED_NUMBER,
  POSTGRES_DATABASE: SCHEMA.REQUIRED_STRING,
  POSTGRES_USERNAME: SCHEMA.REQUIRED_STRING_ALLOW_EMPTY,
  POSTGRES_PASSWORD: SCHEMA.REQUIRED_STRING_ALLOW_EMPTY,
  POSTGRES_HOST: SCHEMA.REQUIRED_STRING,
  POSTGRES_PORT: SCHEMA.REQUIRED_NUMBER,
  POSTGRES_DIALECT: SCHEMA.REQUIRED_STRING,
  TOKEN_SECRET: SCHEMA.REQUIRED_STRING,
});

const validateAppConfig = (
  schema: ObjectSchema,
  config: Record<string, unknown>,
): void => {
  const result = schema.validate(config, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (result.error) {
    logger.error("Application configuration error.");

    throw result.error;
  }
};

export const validateEnv = () => {
  try {
    validateAppConfig(schema, process.env);
  } catch (e) {
    console.error("Can't start app. Env config invalid.");
    process.exit(1);
  }
};
