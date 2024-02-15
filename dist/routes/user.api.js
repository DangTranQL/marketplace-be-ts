"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_controller_1 = __importDefault(require("../controllers/user/user.controller"));
const validation_1 = require("../helpers/validation");
router.post("/", validation_1.validateCreateUser, user_controller_1.default.createUser);
router.get("/", user_controller_1.default.getUsers);
router.get("/:id", validation_1.validateId, user_controller_1.default.getUserById);
router.get("/:id/orders", validation_1.validateId, user_controller_1.default.getOrder);
router.put("/:id", validation_1.validateId, user_controller_1.default.updateUserById);
router.put("/:id/orders", validation_1.validateId, user_controller_1.default.createOrderItem);
router.delete("/:id", validation_1.validateId, user_controller_1.default.deleteUserById);
router.delete("/:username", user_controller_1.default.deleteUserByUsername);
router.delete("/", user_controller_1.default.deleteAllUsers);
exports.default = router;
