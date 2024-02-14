"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const order_controller_1 = __importDefault(require("../controllers/order/order.controller"));
const validation_1 = require("../helpers/validation");
router.post("/", validation_1.validateCreateOrder, order_controller_1.default.createOrder);
router.get("/:id", validation_1.validateId, order_controller_1.default.getOrderById);
router.get("/search/:userID", validation_1.validateUserID, order_controller_1.default.getOrderByUserId);
router.put("/:id", validation_1.validateId, order_controller_1.default.updateOrder);
router.put("/item/:id", validation_1.validateId, order_controller_1.default.updateItem);
router.delete("/:id", validation_1.validateId, order_controller_1.default.deleteOrderById);
router.delete("/:userID", validation_1.validateUserID, order_controller_1.default.deleteOrderByUserId);
router.delete("/:id/item", validation_1.validateId, order_controller_1.default.deleteItemById);
exports.default = router;
