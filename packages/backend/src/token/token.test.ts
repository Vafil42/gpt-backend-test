import { INestApplication, ValidationPipe } from "@nestjs/common";
import "@nestjs/testing";
import { TokenModule } from "./token.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ContextIdFactory } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import { TokenService } from "./token.service";
import { Dialog, DialogDocument } from "./schemas/dialog";

export const tokenTest = () =>
  describe("Token", () => {
    let app: INestApplication;
    let tokenService: TokenService;
    let dialog: DialogDocument;

    beforeAll(async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [
          TokenModule,
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
      tokenService = await moduleRef.resolve(TokenService, contextId);

      app = moduleRef.createNestApplication();
      app.useGlobalPipes(new ValidationPipe({ transform: true }));
      await app.init();
    });

    it("should create dialog", async () => {
      dialog = await tokenService.createDialog("test", "Что такое помело");

      console.log(dialog);

      expect(dialog).toBeTruthy();
      expect(dialog.id).toBeTruthy();
      expect(dialog.messages[1]).toBeTruthy();
    });

    it("should send message", async () => {
      dialog = await tokenService.sendMessage(dialog, "test");

      expect(dialog.messages[2].content).toBe("test");
    });

    afterAll(async () => {
      await app.close();
    });
  });
