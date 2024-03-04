import express from "express";
const router = express.Router();
import orderController from "../controllers/order/order.controller";
import { validateCreateOrder, validateId, validateUserID } from "../helpers/validation";
import { loginRequired } from "../helpers/authentication";

router.post("/", validateCreateOrder, loginRequired, orderController.createOrder);

router.post("/:id/item", validateId, loginRequired, orderController.createItem);

router.get("/:id", validateId, loginRequired, orderController.getOrderById);

router.get("/user/:userID", validateUserID, loginRequired, orderController.getOrdersByUserId);

router.post("/addCart", loginRequired, orderController.addToCart);

router.get("/:id/item/:itemid", loginRequired, orderController.getOrderItemById);

router.patch("/:id", validateId, loginRequired, orderController.updateOrder);

router.patch("/:id/item/:itemid", loginRequired, orderController.updateItem);

router.delete("/:id", validateId, loginRequired, orderController.deleteOrderById);

router.delete("/:id/item", validateId, loginRequired, orderController.deleteItemById);

export default router;