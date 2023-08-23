import pgPromise from "pg-promise";
import { logger } from "./logger";

const pgp = pgPromise();

const dbConfig = {
  connectionString: process.env.PG_CONNECTION_STRING,
};

console.log(process.env.PG_CONNECTION_STRING);

let attempts = 0;

export const initDatabase = async () => {
  try {
    const db = pgp(dbConfig);
    const connection = await db.connect();
    console.log("Successfully Connected to PostgreSQL");
    connection.done(); // Release the connection
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
