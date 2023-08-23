import { createApp } from "./util/express";
import { logger } from "./util/logger";
import { initDatabase } from "./util/postgres";
import { userRoutes } from "./util/useRoutes";

const name = "User Posts & Comments Service";

const init = () => createApp(name, userRoutes);

(async () => {
  logger.info("Connecting to database");
  await initDatabase();

  init().listen(process.env.PORT, () => {
    logger.info(`${name} Started successfully on :${process.env.PORT}`);
  });
})();
