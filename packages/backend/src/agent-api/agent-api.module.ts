import { Module } from "@nestjs/common";
import { AgentApiController } from "./agent-api.controller";
import { AgentApiService } from "./agent-api.service";
import { AgentModule } from "src/agent/agent.module";
import { TokenModule } from "src/token/token.module";

@Module({
  imports: [AgentModule, TokenModule],
  controllers: [AgentApiController],
  providers: [AgentApiService],
})
export class AgentApiModule { }
