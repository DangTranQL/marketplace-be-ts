import { Request, Response, NextFunction } from "express";
import { sendResponse, AppError, catchAsync } from "../../helpers/utils";
import Order from "../../models/order";
import OrderItem from "../../models/orderItem";
import Product from "../../models/product";

interface OrderController {
  createOrder: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  createItem: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  getOrdersOfCurrentUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  getOrderItemById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  getAllOrders: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  getOrderById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  updateOrder: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  updateItem: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  addToCart: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  deleteOrderById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  deleteItemById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

const orderController: OrderController = {
  createOrder: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { userID, status } = req.body;
    // check if order already exists
    let checkOrder = await Order.findOne({ userID, status: "pending" });
    if (checkOrder) {
      sendResponse(res, 200, true, { order: checkOrder }, null, "Order already exists");
    }
    let newOrder = await Order.create({ userID, status, price: 0});

    sendResponse(res, 200, true, { newOrder }, null, "Order created");
  }),

  createItem: catchAsync(async (req: any, res: Response, next: NextFunction) => {
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
  }),

  getOrdersOfCurrentUser: catchAsync(async (req: any, res: Response, next: NextFunction) => {
    const userID = req.userId;
    let {page='1', limit='10', ...filter} = {...req.query};
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

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
  }),

  getAllOrders: catchAsync(async (req: any, res: Response, next: NextFunction) => {
    const userID = req.userId;
    console.log(userID);
    const pendingOrder = await Order.find({ status: "pending", userID });
    const pastOrders = await Order.find({ status: "completed", userID });
  
    sendResponse(res, 200, true, { pendingOrder, pastOrders }, null, null);
  }),

  getOrderById: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    let order = await Order.findOne({ _id: id });
    if (!order) {
      throw new AppError(404, "Order not found", "Get Order Error");
    }
    let orderItems = await OrderItem.find({ orderID: id });
    sendResponse(res, 200, true, { order, orderItems }, null, "Get Order by Id successful");
  }),

  addToCart: catchAsync(async (req: any, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const { productID, title, quantity, itemPrice, image } = req.body;
    let order = await Order.findOne({ userID: userId, status: "pending" });
    if (!order) {
      order = await Order.create({ userID: userId, status: "pending", price: 0 });
      let item = await OrderItem.create({ orderID: order._id, productID, title, quantity, itemPrice, image });
      order.price = item.itemPrice * item.quantity;
      await order.save();
      sendResponse(res, 200, true, { order }, null, "Item added to cart");
    } else {
      let item = await OrderItem.create({ orderID: order._id, productID, title, quantity, itemPrice, image });
      order.price += item.itemPrice * item.quantity;
      await order.save();
      sendResponse(res, 200, true, { order }, null, "Item added to cart");
    }
  }),

  getOrderItemById: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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
  }),

  updateOrder: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status, paymentMethod } = req.body;
    let order = await Order.findOneAndUpdate({ _id: id }, { status, paymentMethod });
    if (!order) {
      throw new AppError(404, "Order not found", "Update Order Error");
    }
    if (status === "completed") {
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
    }
    sendResponse(res, 200, true, { order }, null, "Order updated");
  }),

  updateItem: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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

    order.price += item.itemPrice;
    await order.save();
    item.quantity += change;
    await item.save();
    sendResponse(res, 200, true, { order, item }, null, "Item updated");
  }),

  deleteOrderById: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    let order = await Order.findOne({ _id: id });
    if (!order) {
      throw new AppError(404, "Order not found", "Delete Order Error");
    } 

    await OrderItem.deleteMany({ orderID: id });
    await Order.deleteOne({ _id: id });

    sendResponse(res, 200, true, null, null, "Order deleted");
  }),

  deleteItemById: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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
  }),
};

export default orderController;