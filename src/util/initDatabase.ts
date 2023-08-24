import { Sequelize } from "sequelize-typescript";
import { logger } from "./logger";
import connectSequelize from "./sequelize";
let attempts = 0;

export const initDatabase = async () => {
  try {
    logger.info("Successfully Connected to PostgreSQL");
  } catch (error) {
    const nextConnect = ++attempts * (Math.random() * 10000);

    if (attempts >= 5) {
      logger.error("Unable to establish database connection", error);
      process.exit(1);
    }

    logger.error(
      `[Attempt #${attempts}]. Unable to connect to Database: ${error}. Reconnecting in ${Math.floor(
        nextConnect / 1000,
      )} seconds`,
    );

    setTimeout(initDatabase, nextConnect);
  }
};

initDatabase();
