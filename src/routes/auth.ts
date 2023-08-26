import express from "express";

import * as authControllers from "../controllers/auth";
import * as authValidation from "../validations/auth";
import * as middleware from "../middlewares/validateToken";

const router = express.Router();

router.post("/login", authValidation.validateLogin, authControllers.login);

router.post("/users", authValidation.validateSignUp, authControllers.signUp);
router.use(middleware.validateToken);

router.get("/users", authControllers.getAllUsers);

export default router;
