"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const utils_1 = require("./helpers/utils");
const index_1 = __importDefault(require("./routes/index"));
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use((0, cors_1.default)());
/* DB connection*/
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
    console.error("MongoDB URI not provided in the environment variables.");
    process.exit(1);
}
mongoose_1.default
    .connect(mongoURI)
    .then(() => console.log(`DB connected ${mongoURI}`))
    .catch((err) => console.error(err));
app.use("/", index_1.default);
// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new utils_1.AppError(404, "Not Found", "Bad Request");
    next(err);
});
/* Initialize Error Handling */
app.use((err, req, res, next) => {
    console.error("ERROR", err);
    return (0, utils_1.sendResponse)(res, err.statusCode ? err.statusCode : 500, false, null, { message: err.message }, err.isOperational ? err.errorType : "Internal Server Error");
});
exports.default = app;
