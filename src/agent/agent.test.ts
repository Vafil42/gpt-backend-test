import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AgentModule } from "./agent.module";
import { MongooseModule } from "@nestjs/mongoose";
import * as dotenv from "dotenv";
import * as request from "supertest";
import { exec } from "child_process";
import { join } from "path";

dotenv.config();

describe("Agent", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AgentModule,
        MongooseModule.forRoot(
          `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_TEST_PORT}`,
          { user: process.env.MONGODB_USER, pass: process.env.MONGODB_PASS },
        ),
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  it("POST sing-up 201", () => {
    return request(app.getHttpServer())
      .post("/auth/sing-up")
      .send({
        login: "test",
        password: "test",
      })
      .expect(201);
  });

  it("POST login 201", () => {
    return request(app.getHttpServer())
      .post("/auth/login")
      .send({
        login: "test",
        password: "test",
      })
      .expect(201);
  });

  it("POST sing-up 400", () => {
    return request(app.getHttpServer())
      .post("/auth/sing-up")
      .send({})
      .expect(400);
  });

  it("POST login 400", () => {
    return request(app.getHttpServer())
      .post("/auth/login")
      .send({})
      .expect(400);
  });

  it("POST sing-up 400", () => {
    return request(app.getHttpServer())
      .post("/auth/sing-up")
      .send({
        login: "test",
        password: "test",
      })
      .expect(400);
  });

  it("POST login 401", () => {
    return request(app.getHttpServer())
      .post("/auth/login")
      .send({
        login: "test",
        password: "wrong",
      })
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
    exec(`${join(__dirname, "../../restart-test-db.sh")}`);
  });
});
