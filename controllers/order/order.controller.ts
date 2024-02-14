import { Request, Response, NextFunction } from "express";
import { sendResponse, AppError, catchAsync } from "../../helpers/utils";
import Order from "../../models/order";
import OrderItem from "../../models/orderItem";

interface OrderController {
  createOrder: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  getOrderById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  getOrderByUserId: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  updateOrder: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  updateItem: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  deleteOrderById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  deleteOrderByUserId: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  deleteItemById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

const orderController: OrderController = {
  createOrder: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { userID, status, paymentMethod } = req.body;
    // check if order already exists
    let checkOrder = await Order.findOne({ userID, isDeleted: false });
    if (checkOrder && checkOrder.status === "pending") {
      throw new AppError(400, "Order already exists", "Create Order Error");
    }
    let newOrder = await Order.create({ userID, status, paymentMethod });

    sendResponse(res, 200, true, { newOrder }, null, "Order created");
  }),

  getOrderById: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    let order = await Order.findOne({ _id: id, isDeleted: false });
    if (!order) {
      throw new AppError(404, "Order not found", "Get Order Error");
    }
    let orderItems = await OrderItem.find({ orderID: order._id });
    
    sendResponse(res, 200, true, { orderItems }, null, "Get Order by Id successful");
  }),

  getOrderByUserId: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { userID } = req.params;
    let order = await Order.findOne({ userID: userID, isDeleted: false });
    if (!order) {
      throw new AppError(404, "Order not found", "Get Order Error");
    }
    let orderItems = await OrderItem.find({ orderID: order._id });

    sendResponse(res, 200, true, { orderItems }, null, "Get Order by User Id successful");
  }),

  updateOrder: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status, paymentMethod } = req.body;
    let order = await Order.findOneAndUpdate({ _id: id, isDeleted: false }, { status, paymentMethod });
    if (!order) {
      throw new AppError(404, "Order not found", "Update Order Error");
    }

    sendResponse(res, 200, true, { order }, null, "Order updated");
  }),

  updateItem: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { productID, quantity } = req.body;
    let order = await Order.findOne({ _id: id, isDeleted: false });
    if (!order) {
      throw new AppError(404, "Order not found", "Update Item Error");
    }
    let item = await OrderItem.findOne({ orderID: id, productID: productID, isDeleted: false });
    if (!item) {
      throw new AppError(404, "Item not found", "Update Item Error");
    }

    order.price -= item.itemPrice * item.quantity;
    item.quantity = quantity;
    await item.save();
    order.price += item.itemPrice * item.quantity;
    await order.save();
    sendResponse(res, 200, true, { order }, null, "Item updated");
  }),

  deleteOrderById: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    let order = await Order.findOne({ _id: id, isDeleted: false });
    if (!order) {
      throw new AppError(404, "Order not found", "Delete Order Error");
    } else {
      let orderItems = await OrderItem.find({ orderID: order._id });
      for (let i = 0; i < orderItems.length; i++) {
        orderItems[i].isDeleted = true;
        await orderItems[i].save();
      }
    }
    order.isDeleted = true;
    await order.save();
    sendResponse(res, 200, true, null, null, "Order deleted");
  }),

  deleteOrderByUserId: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { userID } = req.params;
    let order = await Order.findOne({ userID: userID, isDeleted: false });
    if (!order) {
      throw new AppError(404, "Order not found", "Delete Order Error");
    } else {
      let orderItems = await OrderItem.find({ orderID: order._id });
      for (let i = 0; i < orderItems.length; i++) {
        orderItems[i].isDeleted = true;
        await orderItems[i].save();
      }
    }
    order.isDeleted = true;
    await order.save();
    sendResponse(res, 200, true, null, null, "Order deleted");
  }),

  deleteItemById: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { productID } = req.body;
    let order = await Order.findOne({ _id: id, isDeleted: false });
    if (!order) {
      throw new AppError(404, "Order not found", "Delete Item Error");
    }
    let item = await OrderItem.findOne({ orderID: id, productID: productID, isDeleted: false });
    if (!item) {
      throw new AppError(404, "Item not found", "Delete Item Error");
    }
    order.price -= item.itemPrice * item.quantity;
    await OrderItem.deleteOne({ _id: item._id });
    await order.save();
    let items = await OrderItem.find({ orderID: id, isDeleted: false });
    sendResponse(res, 200, true, { order }, null, "Item deleted");
  }),
};

export default orderController;