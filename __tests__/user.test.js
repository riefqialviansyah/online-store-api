const { describe, expect, test } = require("@jest/globals");
const request = require("supertest");
const { User } = require("../models");
const app = require("../app");

beforeAll(async () => {});

afterAll(async () => {
  await User.destroy({ truncate: true, cascade: true, restartIdentity: true });
});

describe("User model", () => {
  it("should create a user", async () => {
    const userData = {
      username: "user1",
      email: "user1@mail.com",
      password: "user1",
    };

    const response = await request(app).post("/user/register").send(userData);

    expect(response.status).toBe(201);
    expect(response.body.user).toHaveProperty("username", userData.username);
    expect(response.body.user).toHaveProperty("email", userData.email);
  });

  it("should error when creating a user with the same email", async () => {
    const userData = {
      username: "user2",
      email: "user1@mail.com", // Same email as the previous user
      password: "user2",
    };

    const response = await request(app).post("/user/register").send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email already exists");
  });

  it("should login a user", async () => {
    const userData = {
      email: "user1@mail.com",
      password: "user1",
    };

    const response = await request(app).post("/user/login").send(userData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Success login");
    expect(response.body).toHaveProperty("token", expect.any(String));
  });

  it("should error when login with not proper input data", async () => {
    const userData = {
      email: "user1@mail.com", // password is missing
    };

    const response = await request(app).post("/user/login").send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Email and password is required"
    );
  });

  it("should error when login with invalid email", async () => {
    const userData = {
      email: "user2@mail.com", // user2 is not exist
      password: "user2",
    };

    const response = await request(app).post("/user/login").send(userData);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Invalid email or password"
    );
  });

  it("should error when login with invalid password", async () => {
    const userData = {
      email: "user1@mail.com",
      password: "wrongpassword", // wrong password
    };

    const response = await request(app).post("/user/login").send(userData);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Invalid username or password"
    );
  });
});
