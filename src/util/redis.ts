import IORedis, { Redis } from "ioredis";

import { REDIS_URL } from "../config/env";

import { logger } from "./logger";

let redis: Redis;

export const redisConnection = (): Redis => {
  if (!redis) {
    redis = new IORedis(`${REDIS_URL}`);

    const connectHandler = (...args: any[]) => {
      logger.info(`connection to Redis Established ${args}`);
    };

    redis.on("connect", connectHandler);

    redis.once("close", () => {
      logger.error(`Default connection to redis closed`);
      process.exit(1);
    });

    redis.once("error", (error) => {
      logger.error(`Unable to establish default connection to redis`);
      process.exit(1);
    });
  }

  return redis;
};
