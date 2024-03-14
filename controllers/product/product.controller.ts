import { Request, Response, NextFunction } from "express";
import { sendResponse, AppError, catchAsync } from "../../helpers/utils";
import Product from "../../models/product";

interface ProductController {
  createProduct: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  getProducts: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  getProductById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  updateProductById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

type FilterConditionType = {
  title?: { $regex: string, $options: string }; 
  category?: { $regex: string, $options: string };
  min?: number;
  max?: number;
  price?: { $gte?: number, $lte?: number };
};

const productController: ProductController = {
  createProduct: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, category, stocks, price, image } = req.body;
    // check if product already exists
    let checkProduct = await Product.findOne({ title: title });
    if (checkProduct) {
      throw new AppError(400, "Product already exists", "Create Product Error");
    }
    let newProduct = await Product.create({ title, description, category, stocks, price, image });
    sendResponse(res, 200, true, { newProduct }, null, "Product created");
  }),

  getProducts: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let { page: pageQuery, limit: limitQuery, ...filter } = req.query;

    const page = parseInt(pageQuery as string) || 1;
    const limit = parseInt(limitQuery as string) || 10;

    let filterCondition: FilterConditionType[] = [];
    if (filter.title) {
      filterCondition.push({
        title: { $regex: filter.title as string, $options: "i" },
      });
    }

    if (filter.category) {
      filterCondition.push({
        category: { $regex: filter.category as string, $options: "i" },
      });
    }

    const filterCriteria = filterCondition.length ? { $and: filterCondition } : {};

    const count = await Product.countDocuments(filterCriteria);
    const totalPages = Math.ceil(count / limit);
    const offset = (page - 1) * limit;

    let products = null;

    if (filter.option == "priceDesc") {
      products = await Product.find(filterCriteria).sort({ price: -1 }).skip(offset).limit(limit);
    } else if (filter.option == "priceAsc") {
      products = await Product.find(filterCriteria).sort({ price: 1 }).skip(offset).limit(limit);
    } else if (filter.option == "featured") {
      products = await Product.find(filterCriteria).sort({ sold: -1 }).skip(offset).limit(limit);
    } else {
      products = await Product.find(filterCriteria).sort({ createdAt: -1 }).skip(offset).limit(limit);
    }

    sendResponse(res, 200, true, { products, totalPages, count }, null, null);
  }),

  getProductById: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    let product = await Product.findOne({ _id: id });
    console.log(product)
    if (!product) {
      throw new AppError(404, "Product not found", "Get Product Error");
    }
    sendResponse(res, 200, true, { product }, null, null);
  }),

  updateProductById: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { title, description, category, stocks, price, image } = req.body;
    let product = await Product.findOne({ _id: id });
    if (!product) {
      throw new AppError(404, "Product not found", "Update Product Error");
    }
    product.title = title;
    product.description = description;
    product.category = category;
    product.stocks = stocks;
    product.price = price;
    product.image = image;
    await product.save();

    sendResponse(res, 200, true, { product }, null, "Product updated");
  }),
};

export default productController;
