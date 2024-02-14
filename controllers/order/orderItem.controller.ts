import { Request, Response, NextFunction } from "express";
import { sendResponse, AppError, catchAsync } from "../../helpers/utils";
import OrderItem from "../../models/orderItem";

interface OrderItemController {
  createItem: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  getAllItems: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

const orderItemController: OrderItemController = {
  createItem: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { orderID, productID, quantity, itemPrice } = req.body;
    // check if item already exists
    let checkItem = await OrderItem.findOne({ productID, isDeleted: false });
    if (checkItem) {
      throw new AppError(400, "Item already exists", "Create Item Error");
    }
    let newItem = await OrderItem.create({ orderID, productID, quantity, itemPrice });
    sendResponse(res, 200, true, { newItem }, null, "Item created");
  }),

  getAllItems: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let { id } = req.params;
    let allItems = await OrderItem.find({ orderID: id, isDeleted: false });
    sendResponse(res, 200, true, { allItems }, null, null);
  }),
};

export default orderItemController;