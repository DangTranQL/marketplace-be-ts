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

const productCreateCheck = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  stocks: Joi.number().required(),
  price: Joi.number().required(),
  image: Joi.string().optional(),
});

const orderCreateCheck = Joi.object({
  userID: Joi.string().required(),
  status: Joi.string().required(),
});

const orderItemCreateCheck = Joi.object({
  orderID: Joi.string().required(),
  productID: Joi.string().required(),
  quantity: Joi.number().required(),
  itemPrice: Joi.number().required(),
  isDeleted: Joi.boolean().optional(),
});

export const validateId = validateSchema(idCheck, "params");
export const validateUserID = validateSchema(userIDCheck, "params");
export const validateCreateUser = validateSchema(userCreateCheck, "body");
export const validateLogin = validateSchema(loginCheck, "body");
export const validateCreateProduct = validateSchema(productCreateCheck, "body");
export const validateCreateOrder = validateSchema(orderCreateCheck, "body");
export const validateCreateOrderItem = validateSchema(orderItemCreateCheck, "body");
