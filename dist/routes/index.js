"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_api_1 = __importDefault(require("./user.api"));
const order_api_1 = __importDefault(require("./order.api"));
const product_api_1 = __importDefault(require("./product.api"));
const auth_api_1 = __importDefault(require("./auth.api"));
const admin_api_1 = __importDefault(require("./admin.api"));
/* User API */
router.use("/user", user_api_1.default);
/* Admin API */
router.use("/admin", admin_api_1.default);
/* Auth API */
router.use("/login", auth_api_1.default);
/* Product API */
router.use("/products", product_api_1.default);
/* Order API */
router.use("/orders", order_api_1.default);
exports.default = router;
