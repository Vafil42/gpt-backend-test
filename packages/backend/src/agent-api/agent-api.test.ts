import { INestApplication } from "@nestjs/common";
import "@nestjs/testing";
import { AgentApiService } from "./agent-api.service";
import { AgentApiModule } from "./agent-api.module";
import { MongooseModule } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";
import { ContextIdFactory } from "@nestjs/core";
import { AgentModule } from "src/agent/agent.module";
import * as request from "supertest";

export const agentApiTest = () =>
  describe("Agent-api", () => {
    let app: INestApplication;
    let agentApiService: AgentApiService;

    beforeAll(async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [
          AgentApiModule,
          AgentModule,
          MongooseModule.forRoot(
            `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_TEST_PORT}`,
            { user: process.env.MONGODB_USER, pass: process.env.MONGODB_PASS },
          ),
        ],
      }).compile();

      const contextId = ContextIdFactory.create();
      jest
        .spyOn(ContextIdFactory, "getByRequest")
        .mockImplementation(() => contextId);
      agentApiService = await moduleRef.resolve(AgentApiService, contextId);

      app = moduleRef.createNestApplication();
      app.useGlobalPipes();
      await app.init();
    });

    it("should create agent", async () => {
      await request(app.getHttpServer())
        .post("/auth/sing-up")
        .send({ login: "agent-test", password: "agent-test" })
        .expect(201);
    });

    it("should update agent", async () => {
      const login = await agentApiService.updateAgent("agent-test", {
        prompt: "U receive message <message>. What will u do?",
        promptTempature: 1.0,
      });
      const agent = await agentApiService.getAgent(login);

      expect(login).toBe("agent-test");
      expect(agent.promptTempature).toBe(1.0);
      expect(agent.prompt).toBe("U receive message <message>. What will u do?");
    });

    it("should create dialog", async () => {
      const dialog = await agentApiService.createDialog("agent-test", "test");

      expect(dialog).toBeTruthy();
      expect(dialog.messages[0].content).toBe(
        "U receive message test. What will u do?",
      );
      expect(dialog.messages[1].role).toBe("assistant");
    });

    afterAll(async () => {
      await app.close();
    });
  });
