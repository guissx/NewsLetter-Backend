import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../api/app"; 
import User from "../src/models/UserModel";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe("Testes de Endpoints Públicos de Usuário", () => {

  it("Deve criar um novo usuário válido", async () => {
    const res = await request(app).post("/users/register").send({
      name: "João Teste",
      email: "joao@example.com",
      password: "SenhaSegura1",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.email).toBe("joao@example.com");
    expect(res.body).not.toHaveProperty("password");
  });

  it("Deve rejeitar criação com email inválido", async () => {
    const res = await request(app).post("/users/register").send({
      name: "João Teste",
      email: "joaoexample.com",
      password: "SenhaSegura1",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Email inválido/i);
  });

  it("Deve rejeitar criação com senha fraca", async () => {
    const res = await request(app).post("/users/register").send({
      name: "João Teste",
      email: "joao@example.com",
      password: "123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/senha deve conter pelo menos 8 caracteres/i);
  });

  it("Deve listar todos os usuários não deletados", async () => {
    await User.create({
      name: "João",
      email: "joao@example.com",
      password: "SenhaSegura1",
    });

    const res = await request(app).get("/users/");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).not.toHaveProperty("password");
  });

  it("Deve buscar usuário por ID", async () => {
    const user = await User.create({
      name: "João",
      email: "joao@example.com",
      password: "SenhaSegura1",
    });

    const res = await request(app).get(`/users/${user._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe("joao@example.com");
  });

  it("Deve retornar 404 para ID inexistente", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/users/${fakeId}`);

    expect(res.statusCode).toBe(404);
  });
});
