import { Module } from "@nestjs/common";
import { TokenService } from "./token.service";
import { RefreshTokenService } from "./refresh.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Secret, SecretSchema } from "./schemas/secret";
import { HttpModule } from "@nestjs/axios";
import * as https from "https";
import { ScheduleModule } from "@nestjs/schedule";
import { Dialog, DialogSchema } from "./schemas/dialog";
import { AgentModule } from "src/agent/agent.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Secret.name, schema: SecretSchema },
      { name: Dialog.name, schema: DialogSchema },
    ]),
    HttpModule.register({
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    }),
    ScheduleModule.forRoot(),
    AgentModule,
  ],
  providers: [TokenService, RefreshTokenService],
})
export class TokenModule { }
