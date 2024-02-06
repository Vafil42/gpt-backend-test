import { Module } from "@nestjs/common";
import { AgentModule } from "../agent/agent.module";
import { TokenModule } from "../token/token.module";
import { EntryModule } from "../entry/entry.module";
import { MongooseModule } from "@nestjs/mongoose";
import { AgentApiModule } from "src/agent-api/agent-api.module";
import { config } from "../config/config";

@Module({
  imports: [
    AgentModule,
    TokenModule,
    EntryModule,
    AgentApiModule,
    MongooseModule.forRoot(config.mongo.url, {
      user: config.mongo.user,
      pass: config.mongo.pass,
    }),
  ],
})
export class MainModule { }
