import { validateSchema } from "../helpers/utils";
import Joi from "joi";

const idCheck = Joi.object({
  id: Joi.string().required(),
});

const userIDCheck = Joi.object({
  userID: Joi.string().required(),
});

const userCreateCheck = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().required(),
  address: Joi.string().required(),
  phone: Joi.number().required(),
});

const loginCheck = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const productCheck = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().required(),
  stocks: Joi.number().required(),
  price: Joi.number().required(),
  image: Joi.string().optional(),
});

const getProductCheck = Joi.object({
  page: Joi.number().optional().default(1),
  limit: Joi.number().optional().default(10),
  title: Joi.string().optional(),
  category: Joi.string().optional(),
  option: Joi.string().optional(),
});

const orderCreateCheck = Joi.object({
  userID: Joi.string().required(),
  status: Joi.string().required(),
});

const orderItemCreateCheck = Joi.object({
  productID: Joi.string().required(),
  title: Joi.string().required(),
  quantity: Joi.number().required(),
  itemPrice: Joi.number().required(),
  image: Joi.string().optional(),
});

const getAllOrdersCheck = Joi.object({
  page: Joi.number().optional().default(1),
  limit: Joi.number().optional().default(10),
  status: Joi.string().optional(),
});

export const validateId = validateSchema(idCheck, "params");
export const validateUserID = validateSchema(userIDCheck, "params");
export const validateCreateUser = validateSchema(userCreateCheck, "body");
export const validateLogin = validateSchema(loginCheck, "body");
export const validateProduct = validateSchema(productCheck, "body");
export const validateGetProduct = validateSchema(getProductCheck, "query");
export const validateCreateOrder = validateSchema(orderCreateCheck, "body");
export const validateCreateOrderItem = validateSchema(orderItemCreateCheck, "body");
export const validateGetAllOrders = validateSchema(getAllOrdersCheck, "query");
