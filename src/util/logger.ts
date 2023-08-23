import appRoot from "app-root-path";
import dotenv from "dotenv";
import { createLogger, format, transports } from "winston";

dotenv.config({ path: `${appRoot.path}/.env` });

const NODE_ENV = process.env.NODE_ENV;

export const logger = createLogger({
  transports: [
    // Only log to file in local env
    ...(["", "local", "development"].includes(NODE_ENV?.toLowerCase() ?? "")
      ? [
          new transports.File({
            level: "info",
            filename: `${appRoot}/logs/combined.log`,
            maxsize: 5242880,
            maxFiles: 5,
            format: format.combine(format.timestamp(), format.json()),
          }),
          new transports.File({
            level: "error",
            filename: `${appRoot}/logs/errors.log`,
            handleExceptions: true,
            maxsize: 5242880,
            maxFiles: 5,
            format: format.combine(format.timestamp(), format.json()),
          }),
        ]
      : []),
    new transports.Console({
      level: "debug",
      handleExceptions: true,
      silent: !!(NODE_ENV && NODE_ENV.toLowerCase() === "test"),
      format: ["", "local"].includes(NODE_ENV?.toLowerCase() ?? "")
        ? format.combine(
            format.colorize({ all: true }),
            format.timestamp(),
            format.errors({ stack: true }),
            format.printf(
              (info) => `${info.timestamp} [${info.level}]: ${info.message}`,
            ),
          )
        : format.combine(
            format.timestamp(),
            format.errors({ stack: true }),
            format.json(),
          ),
    }),
  ],
  exitOnError: false,
});
