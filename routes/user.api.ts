import express from "express";
const router = express.Router();
import userController from "../controllers/user/user.controller";
import { validateCreateUser, validateId } from "../helpers/validation";
import { loginRequired } from "../helpers/authentication";

router.post("/", validateCreateUser, userController.createUser);

router.get("/", userController.getUsers);

router.get("/me", loginRequired, userController.getCurrentUser);

router.get("/:id", validateId, userController.getUserById);

router.get("/:id/orders", validateId, userController.getOrder);

router.put("/:id", validateId, userController.updateUserById);

router.put("/:id/orders", validateId, userController.createOrderItem);

router.delete("/:id", validateId, userController.deleteUserById);

router.delete("/:username", userController.deleteUserByUsername);

router.delete("/", userController.deleteAllUsers);

export default router;