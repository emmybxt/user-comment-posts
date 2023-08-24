import { Sequelize } from "sequelize-typescript";
import {
  NODE_ENV,
  POSTGRES_DATABASE,
  POSTGRES_HOST,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_USERNAME,
} from "../config/env";
import { User } from "../models/users";
import { Post } from "../models/posts";
import { logger } from "./logger";

// const connectOptions = {
//   database: POSTGRES_DATABASE,
//   username: POSTGRES_USERNAME,
//   password: POSTGRES_PASSWORD,
//   host: POSTGRES_HOST,
//   port: 5432,
//   dialect: "postgres",
//   models: [Note]
// };

// const dialectOptions = {};

// if (NODE_ENV !== "development") {
//   Object.assign(dialectOptions, {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false,
//     },
//   });
// }

let attempts = 0;

class Database {
  public sequelize: Sequelize | undefined;

  private POSTGRES_DB = POSTGRES_DATABASE as string;
  private POSTGRES_HOST = POSTGRES_HOST as string;
  private POSTGRES_PORT = POSTGRES_PORT as unknown as number;
  private POSTGRES_USER = POSTGRES_USERNAME as unknown as string;
  private POSTGRES_PASSWORD = POSTGRES_PASSWORD as unknown as string;
  constructor() {
    this.connectToPostgreSQL();
  }

  private async connectToPostgreSQL() {
    this.sequelize = new Sequelize({
      database: this.POSTGRES_DB,
      username: this.POSTGRES_USER,
      password: this.POSTGRES_PASSWORD,
      host: this.POSTGRES_HOST,
      port: this.POSTGRES_PORT,
      dialect: "postgres",
      models: [User, Post],
    });

    try {
      await this.sequelize.authenticate();
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

      setTimeout(() => this.connectToPostgreSQL(), nextConnect); // Corrected here
    }
  }
}

export default Database;
