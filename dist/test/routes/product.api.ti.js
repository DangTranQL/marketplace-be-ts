"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const product_api_1 = __importDefault(require("../../routes/product.api"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/", product_api_1.default);
describe("Product API", () => {
    it("should respond with a 200 status code for successfully creating a new product", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post("/")
            .send({
            title: "Product 1",
            description: "Product 1 description",
            price: 10,
            category: "medicine",
            stocks: 100,
            image: "image1.jpg",
        });
        expect(res.status).toEqual(200);
        expect(res.body.data).toHaveProperty("productID");
    }));
    it("should respond with a 400 status code for validation errors", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post("/")
            .send({
            title: "Product 1",
            description: "Product 1 description",
            price: 10,
            category: "drink",
        });
        expect(res.status).toEqual(400);
    }));
    it("should respond with a 200 status code for successfully getting all products", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get("/");
        expect(res.status).toEqual(200);
    }));
    it("should respond with a 200 status code for successfully getting a product by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get("/456");
        expect(res.status).toEqual(200);
    }));
    it("should respond with a 400 status code for validation errors", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get("/abc");
        expect(res.status).toEqual(400);
    }));
    it("should respond with a 200 status code for successfully updating a product by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .put("/456")
            .send({
            title: "Product 1",
            description: "Product 1 description",
            price: 200,
            category: "food",
            stocks: 100,
            image: "image1.jpg",
        });
        expect(res.status).toEqual(200);
    }));
    it("should respond with a 400 status code for validation errors", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .put("/456")
            .send({
            title: "Product 1",
            description: "Product 1 description",
            price: 200,
            category: "sport",
            stocks: 100,
            image: "image1.jpg",
        });
        expect(res.status).toEqual(400);
    }));
});
