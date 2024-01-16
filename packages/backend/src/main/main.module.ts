import { Module } from "@nestjs/common";
import { AgentModule } from "../agent/agent.module";
import { TokenModule } from "../token/token.module";
import { EntryModule } from "../entry/entry.module";
import { MongooseModule } from "@nestjs/mongoose";
import * as dotenv from "dotenv";
import { AgentApiModule } from "src/agent-api/agent-api.module";

dotenv.config();

@Module({
  imports: [
    AgentModule,
    TokenModule,
    EntryModule,
    AgentApiModule,
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}`,
      { user: process.env.MONGODB_USER, pass: process.env.MONGODB_PASS },
    ),
  ],
})
export class MainModule { }
