import express from "express";

import * as postControllers from "../controllers/posts";

const router = express.Router();

router.get("/users/:id/posts", postControllers.getUserPosts);

router.post("/users/:id/posts", postControllers.createPosts);

export default router;
