const { describe, expect, test } = require("@jest/globals");
const request = require("supertest");
const app = require("../app");
const { User, Product, Detail } = require("../models");
const { signToken } = require("../helpers/jwt");
const { uuid } = require("uuidv4");

// global variable
let tokenAdmin;
let tokenUser;
let randomToken;
let productId;

beforeAll(async () => {
  const dataAdmin = {
    username: "admin1",
    email: "admin1@mail.com",
    role: "admin",
    password: "admin1",
  };
  const dataUser = {
    username: "user1",
    email: "user1@mail.com",
    password: "user1",
  };

  const admin1 = await User.create(dataAdmin);
  const user1 = await User.create(dataUser);

  tokenAdmin = signToken({ id: admin1.id });
  tokenUser = signToken({ id: user1.id });
  randomToken = signToken({ id: "89c2dc9d-787b-4502-9d41-f5aa6b46867c" }); // random uuid

  const seedProduct = {
    id: uuid(),
    name: "Samsung Galaxy A32",
    price: 3000000,
    stock: 10,
    imgUrl:
      "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a32-5g-1.jpg",
  };

  const product = await Product.create(seedProduct);
  productId = product.id;

  const seedDetail = {
    ProductId: product.id,
    brand: "Samsung",
    launch: "2021, January 13",
    os: "Android 11, One UI 3.0",
    resolution: "720 x 1600 pixels",
    internalMemory: "64GB 4GB RAM, 128GB 4GB RAM, 128GB 6GB RAM",
    ram: "4GB",
    mainCamera: "48 MP, f/1.8, 26mm (wide), AF",
    selfieCamera: "13 MP, f/2.2, (wide)",
    battery: "Li-Po 5000 mAh, non-removable",
    otherSpec: "Fast charging 15W",
  };

  await Detail.create(seedDetail);
});
afterAll(async () => {
  await User.destroy({ truncate: true, cascade: true, restartIdentity: true });
  await Product.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
  await Detail.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

describe("Product model", () => {
  it("should get all products as admin", async () => {
    const response = await request(app)
      .get("/product/list")
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "List products");
    expect(response.body).toHaveProperty("data", expect.any(Array));
    expect(response.body.data[0]).toHaveProperty("id", expect.any(String));
    expect(response.body.data[0]).toHaveProperty("name", expect.any(String));
    expect(response.body.data[0]).toHaveProperty("price", expect.any(Number));
  });

  it("should error when get all products as user", async () => {
    const response = await request(app)
      .get("/product/list")
      .set("Authorization", `Bearer ${tokenUser}`);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty(
      "message",
      "You are not authorized to access site"
    );
  });

  it("should error when request but dont have token", async () => {
    const response = await request(app).get("/product/list");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  it("should error when request but type of token is not Bearer", async () => {
    const response = await request(app)
      .get("/product/list")
      .set("Authorization", `Token ${tokenAdmin}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  it("should error when request but token is invalid", async () => {
    const response = await request(app)
      .get("/product/list")
      .set("Authorization", `Bearer ${randomToken}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  it("should can add new product as admin", async () => {
    const dataProduct = {
      name: "Samsung Galaxy A52",
      price: 4000000,
      stock: 10,
      imgUrl:
        "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a52-5g-1.jpg",
      brand: "Samsung",
      launch: "2021, March 26",
      os: "Android 11, One UI 3.1",
      resolution: "1080 x 2400 pixels",
      internalMemory: "128GB 4GB RAM, 128GB 6GB RAM, 128GB 8GB RAM",
      ram: "4GB",
      mainCamera: "64 MP, f/1.8, 26mm (wide), AF",
      selfieCamera: "32 MP, f/2.2, 26mm (wide)",
      battery: "Li-Po 4500 mAh, non-removable",
      otherSpec: "Fast charging 25W",
    };

    const response = await request(app)
      .post("/product/add")
      .send(dataProduct)
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "Success add product");
    expect(response.body).toHaveProperty("product", expect.any(Object));
    expect(response.body).toHaveProperty("detail", expect.any(Object));
    expect(response.body.product).toHaveProperty("id", expect.any(String));
    expect(response.body.detail).toHaveProperty("id", expect.any(String));
  });

  it("should error when add new product as admin with not proper input for require data", async () => {
    const dataProduct = {
      //   name: "Samsung Galaxy A52", // name is missing
      price: 4000000,
      stock: 10,
      imgUrl:
        "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a52-5g-1.jpg",
      brand: "Samsung",
      launch: "2021, March 26",
      os: "Android 11, One UI 3.1",
      resolution: "1080 x 2400 pixels",
      internalMemory: "128GB 4GB RAM, 128GB 6GB RAM, 128GB 8GB RAM",
      ram: "4GB",
      mainCamera: "64 MP, f/1.8, 26mm (wide), AF",
      selfieCamera: "32 MP, f/2.2, 26mm (wide)",
      battery: "Li-Po 4500 mAh, non-removable",
      otherSpec: "Fast charging 25W",
    };

    const response = await request(app)
      .post("/product/add")
      .send(dataProduct)
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Product name is required");
  });

  it("should can edit data product as admin", async () => {
    const dataEditProduct = {
      ProductId: productId,
      price: 3500000,
      stock: 5,
    };

    const response = await request(app)
      .put("/product/edit")
      .send(dataEditProduct)
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Success edit product");
    expect(response.body).toHaveProperty("data", expect.any(Object));
    expect(response.body.data).toHaveProperty("price", dataEditProduct.price);
    expect(response.body.data).toHaveProperty("stock", dataEditProduct.stock);
  });

  it("should error not found product to edit because wrong product id", async () => {
    const dataEditProduct = {
      ProductId: "89c2dc9d-787b-4502-9d41-f5aa6b46867c",
      price: 3500000,
      stock: 5,
    };

    const response = await request(app)
      .put("/product/edit")
      .send(dataEditProduct)
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Product not found");
  });

  it("should error when try to edit product but nor input Product Id", async () => {
    const dataEditProduct = {
      price: 3500000,
      stock: 5,
    };

    const response = await request(app)
      .put("/product/edit")
      .send(dataEditProduct)
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "ProductId is required");
  });

  it("should be edit detail product", async () => {
    const detailEdit = {
      ProductId: productId,
      ram: "6GB",
      mainCamera: "64 MP, f/1.8, 26mm (wide), AF",
    };

    const response = await request(app)
      .put("/product/detail/edit")
      .send(detailEdit)
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Success edit detail product"
    );
    expect(response.body).toHaveProperty("data", expect.any(Object));
    expect(response.body.data).toHaveProperty("ram", detailEdit.ram);
    expect(response.body.data).toHaveProperty(
      "mainCamera",
      detailEdit.mainCamera
    );
  });

  it("should error when try edit detail but wrong product id", async () => {
    const detailEdit = {
      ProductId: "89c2dc9d-787b-4502-9d41-f5aa6b46867c", // random uuid
      ram: "6GB",
      mainCamera: "64 MP, f/1.8, 26mm (wide), AF",
    };

    const response = await request(app)
      .put("/product/detail/edit")
      .send(detailEdit)
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Detail not found");
  });

  it("should error when try edit detail but not input Product Id", async () => {
    const detailEdit = {
      ram: "6GB",
      mainCamera: "64 MP, f/1.8, 26mm (wide), AF",
    };

    const response = await request(app)
      .put("/product/detail/edit")
      .send(detailEdit)
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Product id is required");
  });

  it("should server error when try to edit but Product id is not valid uuid", async () => {
    const detailEdit = {
      ProductId: "randomuuid", // not valid uuid
      ram: "6GB",
      mainCamera: "64 MP, f/1.8, 26mm (wide), AF",
    };

    const response = await request(app)
      .put("/product/detail/edit")
      .send(detailEdit)
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Internal server error");
  });

  it("should can delete product as admin", async () => {
    const response = await request(app)
      .delete("/product/delete")
      .send({ ProductId: productId })
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Success delete product");
    expect(response.body).toHaveProperty("data", expect.any(Object));
  });

  it("should error when delete product as admin with not valid Product Id, product not found", async () => {
    const response = await request(app)
      .delete("/product/delete")
      .send({ ProductId: "89c2dc9d-787b-4502-9d41-f5aa6b46867c" }) // random uuid
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Product not found");
  });

  it("should error when try to delete product but not input Product Id", async () => {
    const response = await request(app)
      .delete("/product/delete")
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Product id is required");
  });

  it("should can search product by name", async () => {
    const response = await request(app).get("/product/pub?search=Samsung");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Success get product by name"
    );
    expect(response.body).toHaveProperty("data", expect.any(Object));
    expect(response.body.data).toHaveProperty("page", 1);
    expect(response.body.data.data[0]).toHaveProperty("id", expect.any(String));
  });

  it("should can get product as public with input page number", async () => {
    const response = await request(app).get("/product/pub?page=1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Success get product by name"
    );
    expect(response.body).toHaveProperty("data", expect.any(Object));
    expect(response.body.data).toHaveProperty("page", 1);
    expect(response.body.data).toHaveProperty("totalPage", expect.any(Number));
    expect(response.body.data).toHaveProperty("data", expect.any(Array));
  });
});
