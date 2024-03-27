import express from "express";
const router = express.Router();
import authController from "../controllers/user/auth.controller";
import { validateLogin } from "../helpers/validation";

router.post("/", validateLogin, authController.loginWithEmail);

export default router;