"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_controller_1 = require("../controllers/user/user.controller");
const validation_1 = require("../helpers/validation");
const authentication_1 = require("../helpers/authentication");
router.post("/", validation_1.validateCreateUser, user_controller_1.createUser);
router.get("/me", authentication_1.loginRequired, user_controller_1.getCurrentUser);
router.put("/me", authentication_1.loginRequired, user_controller_1.updateCurrentUser);
exports.default = router;
