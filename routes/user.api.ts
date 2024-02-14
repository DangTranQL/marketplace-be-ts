import express from "express";
const router = express.Router();
import userController from "../controllers/user/user.controller";
import { validateCreateUser, validateId } from "../helpers/validation";

router.post("/", validateCreateUser, userController.createUser);

router.get("/", userController.getUsers);

router.get("/:id", validateId, userController.getUserById);

router.get("/:id/orders", validateId, userController.getOrder);

router.put("/:id", validateId, userController.createOrderItem);

router.delete("/:id", validateId, userController.deleteUserById);

router.delete("/:username", userController.deleteUserByUsername);

router.delete("/", userController.deleteAllUsers);

export default router;