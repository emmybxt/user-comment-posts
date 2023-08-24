import express from "express";

import * as authControllers from "../controllers/auth";

const router = express.Router();

router.post("/register", authControllers.signUp);

router.post("/login", authControllers.login);

router.get("/users/:id/posts", authControllers.getUserPosts);

router.post("/users/:id/posts", authControllers.createPosts);

export default router;
