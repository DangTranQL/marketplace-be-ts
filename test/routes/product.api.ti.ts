import request from "supertest";
import express from "express";
import router from "../../routes/product.api";

const app = express();
app.use(express.json());
app.use("/", router);

describe("Product API", () => {
    it("should respond with a 200 status code for successfully creating a new product", async () => {
        const res = await request(app)
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
    });

    it("should respond with a 400 status code for validation errors", async () => {
        const res = await request(app)
            .post("/")
            .send({
                title: "Product 1",
                description: "Product 1 description",
                price: 10,
                category: "drink",
            });
        expect(res.status).toEqual(400);
    });

    it("should respond with a 200 status code for successfully getting all products", async () => {
        const res = await request(app).get("/");
        expect(res.status).toEqual(200);
    });

    it("should respond with a 200 status code for successfully getting a product by id", async () => {
        const res = await request(app).get("/456");
        expect(res.status).toEqual(200);
    });

    it("should respond with a 400 status code for validation errors", async () => {
        const res = await request(app).get("/abc");
        expect(res.status).toEqual(400);
    });

    it("should respond with a 200 status code for successfully updating a product by id", async () => {
        const res = await request(app)
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
    }); 

    it("should respond with a 400 status code for validation errors", async () => {
        const res = await request(app)
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
    });
});