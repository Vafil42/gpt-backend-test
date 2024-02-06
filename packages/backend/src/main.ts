import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { ValidationPipe } from "@nestjs/common";
import { MainModule } from "./main/main.module";

import { config } from "./config/config";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(MainModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();
  await app.listen(config.app.port);
}
bootstrap();
