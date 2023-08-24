import { config } from "dotenv";

config();

export const env = (name: string, defaultValue = "") =>
  process.env[name] ?? defaultValue;

export const {
  NODE_ENV,
  PORT,
  POSTGRES_CONNECTION_STRING,
  REDIS_URL,
  TOKEN_SECRET,
} = process.env;
