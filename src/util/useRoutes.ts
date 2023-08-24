import { Express } from "express";

import auth from "../routes/auth";

export const userRoutes = (app: Express): void => {
  app.use("/v1/auth", auth);
};
