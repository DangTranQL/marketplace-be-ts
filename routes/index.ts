import express from "express";
const router = express.Router();
import userAPI from "./user.api";
import orderAPI from "./order.api";
import productAPI from "./product.api";
import authAPI from "./auth.api";

/* GET home page. */
router.get("/", (req, res) => {
  res.send("E-Shop");
});

/* User API */
router.use("/users", userAPI);

/* Auth API */
router.use("/login", authAPI);

/* Product API */
router.use("/products", productAPI);

/* Order API */
router.use("/orders", orderAPI);

export default router;