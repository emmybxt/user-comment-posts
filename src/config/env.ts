import { config } from "dotenv";

config();

export const env = (name: string, defaultValue = "") =>
  process.env[name] ?? defaultValue;

export const {
  NODE_ENV,
  PORT,
  POSTGRES_DATABASE,
  POSTGRES_USERNAME,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DIALECT,
  REDIS_URL,
  TOKEN_SECRET,
} = process.env;
