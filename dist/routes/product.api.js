"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const product_controller_1 = __importDefault(require("../controllers/product/product.controller"));
const validation_1 = require("../helpers/validation");
router.post("/", validation_1.validateCreateProduct, product_controller_1.default.createProduct);
router.get("/", product_controller_1.default.getProducts);
router.get("/:id", validation_1.validateId, product_controller_1.default.getProductById);
router.delete("/:id", validation_1.validateId, product_controller_1.default.deleteProductById);
router.delete("/", product_controller_1.default.deleteAllProducts);
exports.default = router;
