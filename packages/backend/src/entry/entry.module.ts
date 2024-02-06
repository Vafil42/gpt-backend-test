import { Module } from "@nestjs/common";
import { EntryService } from "./entry.service";
import { EntryController } from "./entry.controller";
import { AgentModule } from "src/agent/agent.module";
import { TokenModule } from "src/token/token.module";

@Module({
  imports: [AgentModule, TokenModule],
  providers: [EntryService],
  controllers: [EntryController],
})
export class EntryModule { }
