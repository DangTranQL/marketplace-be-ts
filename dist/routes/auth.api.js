"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_controller_1 = __importDefault(require("../controllers/user/auth.controller"));
const validation_1 = require("../helpers/validation");
router.post("/", validation_1.validateLogin, auth_controller_1.default.loginWithEmail);
exports.default = router;
