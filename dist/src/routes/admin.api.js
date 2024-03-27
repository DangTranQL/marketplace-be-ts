"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user/user.controller");
const product_controller_1 = require("../controllers/product/product.controller");
const authentication_1 = require("../helpers/authentication");
const order_controller_1 = require("../controllers/order/order.controller");
const validation_1 = require("../helpers/validation");
const router = express_1.default.Router();
router.get("/users", authentication_1.loginRequired, authentication_1.adminRequired, user_controller_1.getAllUsers);
router.get("/orders", authentication_1.loginRequired, authentication_1.adminRequired, order_controller_1.getAllOrders);
router.post("/products", authentication_1.loginRequired, authentication_1.adminRequired, validation_1.validateProduct, product_controller_1.createProduct);
router.put("/products/:id", authentication_1.loginRequired, authentication_1.adminRequired, validation_1.validateProduct, product_controller_1.updateProductById);
router.delete("/products/:id", authentication_1.loginRequired, authentication_1.adminRequired, validation_1.validateId, product_controller_1.deleteProductById);
exports.default = router;
