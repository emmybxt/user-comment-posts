import { Response } from "express";

import { TOKEN_SECRET } from "../config/env";
import { redisConnection } from "../util/redis";
import jwt from "jsonwebtoken";

export type ResponseType = Response | void;

function setSessionRedisKey(token: string) {
  return `SESSION~${token}`;
}

export async function isTokenValid(token: string): Promise<boolean> {
  const key = setSessionRedisKey(token);

  const value = await redisConnection().get(key);
  if (!value) return false;

  return true;
}

export async function generateUserBearerToken({
  userID,
  userName,
}: {
  userID: number;
  userName: string;
}): Promise<string> {
  const token = jwt.sign(
    { id: userID, name: userName },
    TOKEN_SECRET as string,
    {
      expiresIn: `24h`,
    },
  );

  const key = setSessionRedisKey(token);

  await redisConnection().set(key, token, "EX", 86400);

  return token;
}
