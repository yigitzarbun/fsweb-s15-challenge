const request = require("supertest");
const server = require("./server");
const db = require("../data/dbConfig");

test("[0] Testler çalışır durumda]", () => {
  expect(true).toBe(true);
});

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

afterAll(async () => {
  await db.destroy();
});

describe("API END POINT TESTLERI", () => {
  describe("[POST] /api/auth/register", () => {
    test("[1] başarılı şekilde register oluyor", async () => {
      const user = { username: "başak", password: 1234 };
      const res = await request(server).post("/api/auth/register").send(user);
      expect(res.body).toHaveProperty(
        "id",
        "username",
        "Captain Marvel",
        "password"
      );
    });
    test("[2] eksik bilgi olduğunda doğru mesajı dönüyor", async () => {
      const user = { username: "başak" };
      const res = await request(server).post("/api/auth/register").send(user);
      expect(res.body).toEqual({ message: "username ve şifre gereklidir" });
    });
  });
  describe("[POST] /api/auth/login", () => {
    test("[3] login oluyor ve doğru mesaj dönüyor", async () => {
      const newUser = { username: "test", password: "1234" };
      await request(server).post("/api/auth/register").send(newUser);
      const res = await request(server).post("/api/auth/login").send(newUser);
      expect(res.body).toHaveProperty("message", "welcome, test", "token");
    });
    test("[4] eksik bilgilerle login olamıyor ve doğru mesaj dönüyor", async () => {
      const newUser = { username: "test2", password: 1234 };
      await request(server).post("/api/auth/register").send(newUser);
      const loginDetails = { username: "test2" };
      const res = await request(server)
        .post("/api/auth/login")
        .send(loginDetails);
      expect(res.body).toEqual({ message: "username ve şifre gereklidir" });
    });
  });
  describe("[GET] /api/bilmeceler", () => {
    test("[5] login olmayan ziyaretçilere doğru mesaj dönüyor", async () => {
      const res = await request(server).get("/api/bilmeceler");
      expect(res.body).toEqual({ message: "token gereklidir" });
    });
  });
});
