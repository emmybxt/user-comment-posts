import appRoot from "app-root-path";
import fs from "fs";
import { Client } from "pg";
import { logger } from "./logger";

import { NODE_ENV, POSTGRES_CONNECTION_STRING } from "../config/env";

const connectOptions = {
  connectionString: POSTGRES_CONNECTION_STRING,
};

if (NODE_ENV !== "development") {
  Object.assign(connectOptions, {
    ssl: {
      // require: false,
      rejectUnauthorized: false,
    },
  });
}

export const DBclient = new Client(connectOptions);

let attempts = 0;

export const initDatabase = async () => {
  try {
    await DBclient.connect();

    logger.info("Successfully Connected to PostgreSQL");

    // create Database Tables
    const path = `${appRoot}/src/database/db.sql`;

    const sql = fs.readFileSync(path, "utf8");

    DBclient.query(`${sql}`, (err, res) => {
      if (err) {
        console.log(err);
        logger.warn(`Error executing the database tables and columns`);
      } else {
        logger.info("Executed Tables and rows successfully");
      }
    });
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

    setTimeout(() => initDatabase, nextConnect); // Corrected here
  }
};
