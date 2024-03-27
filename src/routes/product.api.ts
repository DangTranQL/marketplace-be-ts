import express from 'express';
const router = express.Router();
import { getProducts, getProductById } from '../controllers/product/product.controller';
import { validateGetProduct, validateId } from '../helpers/validation';

router.get("/", validateGetProduct, getProducts);

router.get("/:id", validateId, getProductById);

export default router;