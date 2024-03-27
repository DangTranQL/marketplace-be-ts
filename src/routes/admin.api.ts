import express from "express";
import { getAllUsers } from "../controllers/user/user.controller";
import { createProduct, updateProductById, deleteProductById } from "../controllers/product/product.controller";
import { adminRequired, loginRequired } from "../helpers/authentication";
import { getAllOrders } from "../controllers/order/order.controller";
import { validateId, validateProduct } from "../helpers/validation";
const router = express.Router();

router.get("/users", loginRequired, adminRequired, getAllUsers)

router.get("/orders", loginRequired, adminRequired, getAllOrders)

router.post("/products", loginRequired, adminRequired, validateProduct, createProduct);

router.put("/products/:id", loginRequired, adminRequired, validateProduct, updateProductById);

router.delete("/products/:id", loginRequired, adminRequired, validateId, deleteProductById);

export default router;