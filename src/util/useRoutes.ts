import { Express } from "express";

function auth() {
  return "auth";
}

export const userRoutes = (app: Express): void => {
  app.use("/v1/auth", auth);
};
