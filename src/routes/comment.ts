import express from "express";

import * as commentControllers from "../controllers/comment";
import * as commentValidation from "../validations/comment";
import * as middleware from "../middlewares/validateToken";
const router = express.Router();

// router.get("/posz/:id/posts", postControllers.getUserPosts);

router.use(middleware.validateToken);

router.post(
  "/posts/:id/comments",
  commentValidation.validateCreateComment,
  commentControllers.createComment,
);

export default router;
