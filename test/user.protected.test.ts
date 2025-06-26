import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";
import app from "../api/app";
import User from "../src/models/UserModel";

process.env.JWT_SECRET = "test_secret";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

// Função auxiliar para gerar token válido
const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "1h" });
};

describe("Testes de Rotas Protegidas de Usuário", () => {

  it("Deve atualizar um usuário autenticado", async () => {
    const user = await User.create({
      name: "Teste",
      email: "teste@example.com",
      password: "SenhaSegura1",
    });

    const token = generateToken(user.id);

    const res = await request(app)
      .put(`/users/${user.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Atualizado" });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Atualizado");
  });

  it("Deve deletar um usuário autenticado", async () => {
    const user = await User.create({
      name: "Teste",
      email: "teste@example.com",
      password: "SenhaSegura1",
    });

    const token = generateToken(user.id);

    const res = await request(app)
      .delete(`/users/${user.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/marcado como deletado/i);
  });

  it("Deve restaurar um usuário autenticado", async () => {
    const user = await User.create({
      name: "Teste",
      email: "teste@example.com",
      password: "SenhaSegura1",
      isDeleted: true,
    });

    const token = generateToken(user.id);

    const res = await request(app)
      .patch(`/users/${user.id}/restore`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.isDeleted).toBe(false);
  });

});
