import { Request, Response, NextFunction } from "express";
import { sendResponse, AppError, catchAsync } from "../../helpers/utils";
import Product from "../../models/product";

type FilterConditionType = {
  title?: { $regex: string, $options: string }; 
  category?: { $regex: string, $options: string };
  min?: number;
  max?: number;
  price?: { $gte?: number, $lte?: number };
};

export const createProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, category, stocks, price, image } = req.body;
    // check if product already exists
    // let checkProduct = await Product.findOne({ title: title });
    // if (checkProduct) {
    //   throw new AppError(400, "Product already exists", "Create Product Error");
    // }
    let newProduct = await Product.create({ title, description, category, stocks, price, image });
    sendResponse(res, 200, true, { newProduct }, null, "Product created");
  });

export const getProducts = catchAsync(async (req: any, res: Response, next: NextFunction) => {
    let { page, limit, ...filter } = req.query;

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
  });

export const getProductById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    let product = await Product.findOne({ _id: id });
    if (!product) {
      throw new AppError(404, "Product not found", "Get Product Error");
    }
    sendResponse(res, 200, true, { product }, null, null);
  });

export const updateProductById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { title, description, category, stocks, price, image } = req.body;

    console.log("req.body", req.body)

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
  });


export const deleteProductById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    let product = await Product.findOne({ _id: id });

    if (!product) {
      throw new AppError(404, "Product not found", "Delete Product Error");
    }

    await Product.deleteOne({ _id: id });
    sendResponse(res, 200, true, { product }, null, "Product deleted");
  });