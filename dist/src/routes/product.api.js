"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const product_controller_1 = require("../controllers/product/product.controller");
const validation_1 = require("../helpers/validation");
router.get("/", validation_1.validateGetProduct, product_controller_1.getProducts);
router.get("/:id", validation_1.validateId, product_controller_1.getProductById);
exports.default = router;
