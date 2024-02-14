import express from "express";
const router = express.Router();
import orderController from "../controllers/order.controller";
import { validateCreateOrder, validateId, validateUserID } from "../helpers/validation";

router.post("/", validateCreateOrder, orderController.createOrder);

router.get("/:id", validateId, orderController.getOrderById);

router.get("/search/:userID", validateUserID, orderController.getOrderByUserId);

router.put("/:id", validateId, orderController.updateOrder);

router.put("/item/:id", validateId, orderController.updateItem);

router.delete("/:id", validateId, orderController.deleteOrderById);

router.delete("/:userID", validateUserID, orderController.deleteOrderByUserId);

router.delete("/:id/item", validateId, orderController.deleteItemById);

export default router;