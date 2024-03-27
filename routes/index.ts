import express from "express";
const router = express.Router();
import userAPI from "./user.api";
import orderAPI from "./order.api";
import productAPI from "./product.api";
import authAPI from "./auth.api";
import adminAPI from "./admin.api";

/* User API */
router.use("/user", userAPI);

/* Admin API */
router.use("/admin", adminAPI);

/* Auth API */
router.use("/login", authAPI);

/* Product API */
router.use("/products", productAPI);

/* Order API */
router.use("/orders", orderAPI);

export default router;