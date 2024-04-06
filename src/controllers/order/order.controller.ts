import { Request, Response, NextFunction } from "express";
import { sendResponse, AppError, catchAsync } from "../../helpers/utils";
import Order from "../../models/order";
import OrderItem from "../../models/orderItem";
import Product from "../../models/product";
import User from "../../models/user";
import { NodeBuilderFlags } from "typescript";

export const createOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { userID, status } = req.body;
    // check if order already exists
    let checkOrder = await Order.findOne({ userID, status: "pending" });
    if (checkOrder) {
      sendResponse(res, 200, true, { order: checkOrder }, null, "Order already exists");
    }
    let newOrder = await Order.create({ userID, status, price: 0 });

    sendResponse(res, 200, true, { newOrder }, null, "Order created");
  });

export const createItem = catchAsync(async (req: any, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { productID, title, quantity, itemPrice, image } = req.body;
    const userId = req.userId;
    let order = await Order.findOne({ _id: id, userID: userId, status: "pending" });
    if (!order) {
      throw new AppError(404, "Order not found", "Create Item Error");
    }

    const item = await OrderItem.create({ orderID: id, productID, title, quantity, itemPrice, image });
    order.price += item.itemPrice * item.quantity;
    await order.save();
    sendResponse(res, 200, true, { order }, null, "Item created");
  });

export const getOrdersOfCurrentUser = catchAsync(async (req: any, res: Response, next: NextFunction) => {
    const userID = req.userId;
    let { page, limit, ...filter} = req.query;

    const filterConditions: { [key: string]: any }[] = [{ userID: userID }]

    if (filter.status) {
      filterConditions.push({
        status: { $regex: filter.status, $options: "i" },
      });
    }

    const filterCriteria = filterConditions.length > 0 ? { $and: filterConditions } : {};

    const count = await Order.countDocuments(filterCriteria);
    const totalPage = Math.ceil(count / limit);
    const offset = (page - 1) * limit;

    let order = await Order.find(filterCriteria).sort({ createdAt: -1 }).skip(offset).limit(limit);

    sendResponse(res, 200, true, { order, totalPage, count }, null, null);
  });

export const getPendingOrder = catchAsync(async (req: any, res: Response, next: NextFunction) => {
    const userID = req.userId;
    const pendingOrder = await Order.find({ status: "pending", userID });
    const orderItems = await OrderItem.find({ orderID: pendingOrder[0]._id }).sort({ createdAt: -1 });
    const numberOfItems = await OrderItem.find({ orderID: pendingOrder[0]._id }).countDocuments();
  
    sendResponse(res, 200, true, { pendingOrder, orderItems, numberOfItems }, null, null);
  });

export const getCompletedOrders = catchAsync(async (req: any, res: Response, next: NextFunction) => {
    const userID = req.userId;
    let {page, limit} = req.query;

    const count = await Order.countDocuments({});
    const totalPage = Math.ceil(count / limit);
    const offset = (page - 1) * limit;

    const completedOrders = await Order.find({ status: "completed", userID }).sort({ createdAt: -1 }).skip(offset).limit(limit);

    sendResponse(res, 200, true, { completedOrders, totalPage, count }, null, null);
  });

export const getOrderById = catchAsync(async (req: any, res: Response, next: NextFunction) => {
    const { id } = req.params;
    let {page, limit} = req.query;

    const count = await Order.countDocuments({});
    const totalPage = Math.ceil(count / limit);
    const offset = (page - 1) * limit;

    let order = await Order.findOne({ _id: id });
    if (!order) {
      throw new AppError(404, "Order not found", "Get Order Error");
    }
    let orderItems = await OrderItem.find({ orderID: id }).sort({ createdAt: -1 }).skip(offset).limit(limit);
    sendResponse(res, 200, true, { order, orderItems, totalPage, count }, null, "Get Order by Id successful");
  });

export const addToCart = catchAsync(async (req: any, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const { productID, title, quantity, itemPrice, image } = req.body;
    let order = await Order.findOne({ userID: userId, status: "pending" });
    let user = await User.findOne({ _id: userId });
    if (!user) {
      throw new AppError(404, "User not found", "Add to Cart Error");
    }
    if (!order) {
      order = await Order.create({ userID: userId, status: "pending", price: 0, address: null});
      let itemcheck = await OrderItem.findOne({ orderID: order._id, productID });
      if (!itemcheck) {
        let item = await OrderItem.create({ orderID: order._id, productID, title, quantity, itemPrice, image });
        order.price = item.itemPrice * item.quantity;
        await order.save();
        sendResponse(res, 200, true, { order }, null, "Item added to cart");
      } else {
        itemcheck.quantity += 1;
        await itemcheck.save();
        order.price += itemcheck.itemPrice * itemcheck.quantity;
        await order.save();
        sendResponse(res, 200, true, { order }, null, "Duplicate item added to cart");
      }
    } else {
      let item = await OrderItem.create({ orderID: order._id, productID, title, quantity, itemPrice, image });
      order.price += item.itemPrice * item.quantity;
      await order.save();
      sendResponse(res, 200, true, { order }, null, "Item added to cart");
    }
  });

export const getOrderItemById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id, itemid } = req.params;
    let order = await Order.findOne({ _id: id });
    if (!order) {
      throw new AppError(404, "Order not found", "Get Order Error");
    }
    let item = await OrderItem.findOne({ _id: itemid });
    if (!item) {
      throw new AppError(404, "Item not found", "Get Item Error");
    }
    sendResponse(res, 200, true, { item }, null, "Get Item by Id successful");
  });

export const getAllOrders = catchAsync(async (req: any, res: Response, next: NextFunction) => {
    let { page, limit, ...filter } = req.query;

    const filterConditions: { [key: string]: any }[] = [];

    if (filter.status) {
      filterConditions.push({
        status: { $regex: filter.status, $options: "i" },
      });
    }
    if (filter.userID) {
      filterConditions.push({
        userID: { $regex: filter.userID, $options: "i" },
      });
    }

    const filterCriteria = filterConditions.length > 0 ? { $and: filterConditions } : {};

    const count = await Order.countDocuments(filterCriteria);
    const totalPage = Math.ceil(count / limit);
    const offset = (page - 1) * limit;

    let orders = await Order.find(filterCriteria).sort({ createdAt: -1 }).skip(offset).limit(limit);

    sendResponse(res, 200, true, { orders, totalPage, count }, null, null);
  }
);

export const updateOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status, address, paymentMethod } = req.body;
    let order = await Order.findOneAndUpdate({ _id: id }, { status: status, address: address, paymentMethod: paymentMethod });
    let user = await User.findOne({ _id: order?.userID });
    if (!order) {
      throw new AppError(404, "Order not found", "Update Order Error");
    }
    if (!user) {
      throw new AppError(404, "User not found", "Update Order Error");
    }
    let orderItems = await OrderItem.find({ orderID: id });
    for (let i = 0; i < orderItems.length; i++) {
      let product = await Product.findOne({ _id: orderItems[i].productID });
      if (!product) {
        throw new AppError(404, "Product not found", "Update Order Error");
      }
      product.stocks -= orderItems[i].quantity;
      product.sold += orderItems[i].quantity;
      await product?.save();
    }
    await order.save();
    sendResponse(res, 200, true, { order }, null, "Order updated");
  });

export const updateItem = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id, itemid } = req.params;
    const { change } = req.body;
    let order = await Order.findOne({ _id: id, status: "pending"});
    if (!order) {
      throw new AppError(404, "Order not found", "Update Item Error");
    }
    let item = await OrderItem.findOne({ orderID: id, _id: itemid });
    if (!item) {
      throw new AppError(404, "Item not found", "Update Item Error");
    }

    order.price += item.itemPrice * change;
    await order.save();
    item.quantity += change;
    await item.save();
    sendResponse(res, 200, true, { order, item }, null, "Item updated");
  });

export const deleteOrderById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    let order = await Order.findOne({ _id: id });
    if (!order) {
      throw new AppError(404, "Order not found", "Delete Order Error");
    } 

    await OrderItem.deleteMany({ orderID: id });
    await Order.deleteOne({ _id: id });

    sendResponse(res, 200, true, null, null, "Order deleted");
  });

export const deleteItemById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id, itemid } = req.params;
    let order = await Order.findOne({ _id: id, status: "pending"});
    if (!order) {
      throw new AppError(404, "Order not found", "Delete Item Error");
    }
    let item = await OrderItem.findOne({ orderID: id, _id: itemid });
    if (!item) {
      throw new AppError(404, "Item not found", "Delete Item Error");
    }
    order.price -= item.itemPrice * item.quantity;
    await OrderItem.deleteOne({ _id: item._id });
    await order.save();
    sendResponse(res, 200, true, { order }, null, "Item deleted");
  });