import express from "express";

import * as postControllers from "../controllers/posts";
import * as postValidation from "../validations/post";
const router = express.Router();

router.get(
  "/users/:id/posts",
  postValidation.validateGetUserPost,
  postControllers.getUserPosts,
);

router.post(
  "/users/:id/posts",
  postValidation.validateCreatePost,
  postControllers.createPosts,
);

router.get("/users/top-comment", postControllers.getTopUsersAndComment);
export default router;
