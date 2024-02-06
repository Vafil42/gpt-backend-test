import { Module } from "@nestjs/common";
import { AgentService } from "./agent.service";
import { AgentController } from "./agent.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Agent, AgentSchema } from "./schemas/agent.schema";
import { JwtModule } from "@nestjs/jwt";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./agent.guard";

import { config } from "../config/config";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Agent.name, schema: AgentSchema }]),
    JwtModule.register({
      secret: config.secret.jwt,
      signOptions: { expiresIn: "24h" },
    }),
  ],
  providers: [
    AgentService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AgentController],
  exports: [AgentService],
})
export class AgentModule { }
