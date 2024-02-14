import express from 'express';
const router = express.Router();
import productController from '../controllers/product/product.controller';
import { validateCreateProduct, validateId } from '../helpers/validation';

router.post("/", validateCreateProduct, productController.createProduct);

router.get("/", productController.getProducts);

router.get("/:id", validateId, productController.getProductById);

router.delete("/:id", validateId, productController.deleteProductById);

router.delete("/", productController.deleteAllProducts)

export default router;