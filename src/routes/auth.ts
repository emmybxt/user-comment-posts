import express from "express";

import * as authControllers from "../controllers/auth";
import * as authValidation from "../validations/auth";
const router = express.Router();

router.post("/users", authValidation.validateSignUp, authControllers.signUp);

router.get("/users", authControllers.getAllUsers);

router.post("/login", authValidation.validateLogin, authControllers.login);

export default router;
