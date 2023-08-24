import appRoot from "app-root-path";
import fs from "fs";
import { Client } from "pg";

import {
  NODE_ENV,
  POSTGRES_DATABASE,
  POSTGRES_HOST,
  POSTGRES_PASSWORD,
  POSTGRES_USERNAME,
} from "../config/env";
import { logger } from "./logger";

const connectOptions = {
  database: POSTGRES_DATABASE,
  username: POSTGRES_USERNAME,
  password: POSTGRES_PASSWORD,
  host: POSTGRES_HOST,
  port: 5432,
  dialect: "postgres",
};

const dialectOptions = {};

if (NODE_ENV !== "development") {
  Object.assign(dialectOptions, {
    ssl: {
      require: true,
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
