import { json } from "body-parser";
import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import ResponseHandler from "./response-handler";
import requestLogger from "../middlewares/requestLogger";

export const createApp = (
  name = "User Posts & Comments",
  bindRoutes: (app: Express) => void,
): Express => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(json({ limit: "5mb" }));
  app.disable("x-powered-by");

  app.use(requestLogger);

  bindRoutes(app);

  app.get("/", async (req, res) => {
    res.json({
      message: `Welcome to ${name}`,
      success: true,
    });
  });

  app.get("/throw-error", (req, res, next: NextFunction) => {
    const error = new Error("Error handling middleware works");
    return next(error);
  });

  app.use((req, res: Response) => {
    return ResponseHandler.sendErrorResponse({ error: "Route not found", res });
  });

  return app;
};
