import { PORT } from "./config/env";
import { validateEnv } from "./config/validate";
import { createApp } from "./util/express";
import { logger } from "./util/logger";
import { redisConnection } from "./util/redis";
import { initDatabase } from "./util/sequelize";
import { userRoutes } from "./util/useRoutes";
// import Database from "./util/sequelize";
const name = "User Posts & Comments Service";

export const init = () => createApp(name, userRoutes);

(async () => {
  validateEnv();

  logger.info("Connecting to database");

  // const db = new Database();
  // db.sequelize!.sync();

  await initDatabase();

  logger.info("connecting To Redis");

  await redisConnection();

  init().listen(PORT, () => {
    logger.info(`${name} Started successfully on :${PORT}`);
  });
})();
