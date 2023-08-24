import { Express } from "express";

import auth from "../routes/auth";
import post from "../routes/posts";
import comment from "../routes/comment";

export const userRoutes = (app: Express): void => {
  app.use("/v1/", auth);
  app.use("/v1/", post);
  app.use("/v1/", comment);
};
