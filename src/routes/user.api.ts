import express from "express";
const router = express.Router();
import { createUser, getCurrentUser, updateCurrentUser } from "../controllers/user/user.controller";
import { validateCreateUser } from "../helpers/validation";
import { loginRequired } from "../helpers/authentication";

router.post("/", validateCreateUser, createUser);

router.get("/me", loginRequired, getCurrentUser);

router.put("/me", loginRequired, updateCurrentUser);

export default router;