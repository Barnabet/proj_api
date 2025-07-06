const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/server"); // export the Express instance from server.js

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key";

describe("GET /api/v1/hello", () => {
  it("returns 401 without token", async () => {
    const res = await request(app).get("/api/v1/hello");
    expect(res.statusCode).toBe(401);
  });

  it("greets the user with valid token", async () => {
    const fakeUser = { sub: 1, name: "Test User" };
    const token = jwt.sign(fakeUser, JWT_SECRET);
    const res = await request(app)
      .get("/api/v1/hello")
      .set("Authorization", `Bearer ${token}`);
    expect(res.body.message).toMatch("Hello, Test User");
  });
});