import express from "express";
const router = express.Router();
import userController from "../controllers/user/user.controller";
import { validateCreateUser, validateId } from "../helpers/validation";
import { loginRequired } from "../helpers/authentication";

router.post("/", validateCreateUser, userController.createUser);

router.get("/me", loginRequired, userController.getCurrentUser);

router.put("/me", loginRequired, userController.updateCurrentUser);

export default router;