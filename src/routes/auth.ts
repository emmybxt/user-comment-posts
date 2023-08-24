import express from "express";

import * as authControllers from "../controllers/auth";

const router = express.Router();

router.post("/users", authControllers.signUp);

router.get("/users", authControllers.getAllUsers);

router.post("/login", authControllers.login);

export default router;
