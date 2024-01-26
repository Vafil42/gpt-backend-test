import { INestApplication, Logger, ValidationPipe } from "@nestjs/common";
import "@nestjs/testing";
import { TokenModule } from "./token.module";
import { MongooseModule } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";
import { RefreshTokenService } from "./refresh.service";
import { ContextIdFactory } from "@nestjs/core";

export const refreshTest = () =>
  describe("Refresh", () => {
    let app: INestApplication;
    let refreshService: RefreshTokenService;

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
      refreshService = await moduleRef.resolve(RefreshTokenService, contextId);

      app = moduleRef.createNestApplication();
      app.useGlobalPipes(new ValidationPipe({ transform: true }));
      await app.init();
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 100));
    });

    it("should return token", async () => {
      const token = await refreshService.getToken();

      expect(token.split(" ")[0]).toBe("Bearer");
      expect(token.split(" ")[1]).toBeTruthy();
    });

    afterAll(async () => {
      await app.close();
    });
  });
