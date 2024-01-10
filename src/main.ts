import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import * as dotenv from "dotenv";
import { ValidationPipe } from "@nestjs/common";
import { MainModule } from "./main/main.module";

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(MainModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
