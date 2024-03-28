import express from "express";
const router = express.Router();
import { createOrder, getOrdersOfCurrentUser, getPendingOrder, getCompletedOrders, getOrderById, getOrderItemById, updateOrder, updateItem, deleteOrderById, addToCart, deleteItemById} from "../controllers/order/order.controller";
import { validateCreateOrder, validateCreateOrderItem, validateGetAllOrders, validateId } from "../helpers/validation";
import { loginRequired } from "../helpers/authentication";

router.post("/", loginRequired, validateCreateOrder, createOrder);

router.post("/addCart", loginRequired, validateCreateOrderItem, addToCart);

router.get("/", loginRequired, validateGetAllOrders, getOrdersOfCurrentUser);

router.get("/me/pending", loginRequired, getPendingOrder);

router.get("/me/completed", loginRequired, getCompletedOrders);

router.get("/:id", loginRequired, validateId, getOrderById);

router.get("/:id/item/:itemid", loginRequired, getOrderItemById);

router.patch("/:id", loginRequired, validateId, updateOrder);

router.patch("/:id/item/:itemid", loginRequired, updateItem);

router.delete("/:id", loginRequired, validateId, deleteOrderById);

router.delete("/:id/item/:itemid", loginRequired, deleteItemById);

export default router;